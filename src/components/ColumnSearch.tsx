import React, { useRef, useState } from "react";
import { Input, InputRef } from "antd";
import Highlighter from "react-highlight-words";
import { ColumnType, FilterConfirmProps } from "antd/es/table/interface";
import { SearchOutlined } from "@ant-design/icons";

export const getSorter = (
    field: string,
    type: "string" | "number" | "date" = "string"
  ) => {
    return (a: any, b: any) => {
      const valA = a[field];
      const valB = b[field];

      if (type === "number") {
        return (valA || 0) - (valB || 0);
      }

      if (type === "date") {
        return new Date(valA).getTime() - new Date(valB).getTime();
      }

      return (valA || "").toString().localeCompare((valB || "").toString());
    };
  };

export const ColumnSearch = (dataIndex: string): ColumnType<any> => {
  const searchInput = useRef<InputRef>(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  return {
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`ค้นหา`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm)
          }
        />
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "cyan" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ?.toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()) ?? false,
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  };
};
