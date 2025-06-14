import {
  Button,
  Card,
  Checkbox,
  Divider,
  Input,
  message,
  Radio,
  Select,
  TreeSelect,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useCallback, useEffect, useMemo } from "react";
import { Controller } from "react-hook-form";
import FileUpload from "../../components/FileUpload";
import {
  PostManagementFormProps,
  usePostManagementForm,
} from "../../forms/PostManagementForm";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { addPost } from "../../services/postService";
import { fetchPosts } from "../../redux/actions/postActions";
import useIsAdmin from "../../hook/useIsAdmin";
import { typeKM } from "../../config/constant";
import TextEditor from "../../components/TextEditor";
import { CategoryTreeNode } from "../../redux/reducer/categoryReducer";
import {
  FETCH_ALL_USERS_REQUEST,
  FETCH_ALL_USERS_SUCCESS,
} from "../../redux/reducer/userReducer";
import { fetchAllUsers } from "../../services/userService";

export const PostManagementScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const posts = useSelector((state: RootState) => state.posts.posts);
  const { currentUser, allUsers } = useSelector(
    (state: RootState) => state.users
  );
  const isFetchingPosts = useSelector(
    (state: RootState) => state.posts.isFetching
  );
  const navigate = useNavigate();
  const isAdmin = useIsAdmin();
  const [searchParams] = useSearchParams();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = usePostManagementForm();

  const postId = useMemo(() => searchParams.get("id"), [searchParams]);
  const nowType = watch("type");

  const transformedFiles = (files: any) => {
    return files.map((file: any) => ({
      ...file,
      url: `/uploads/${file.file_name.replace(/\\/g, "/")}`,
      name: file.file_file_name,
    }));
  };

  const onStart = useCallback(() => {
    const postById = posts.find((post: any) => post.id === postId);
    if (postById) {
      const atrFile = Array.isArray(postById.files)
        ? transformedFiles(postById.files)
        : [];
      const contents =
        typeof postById.post_contents === "string"
          ? JSON.parse(postById.post_contents)
          : postById.post_contents;

      setValue("title", postById.post_title);
      setValue("category", postById.post_ctg_id);
      setValue("date", postById.post_date);
      setValue("type", postById.post_type);
      setValue("prefixName", postById.post_prefix_name);
      setValue("fname", postById.post_fname);
      setValue("lname", postById.post_lname);
      setValue("position", postById.post_position);
      setValue("department", postById.post_depm);
      setValue("sub_department", postById.post_sub_depm);
      setValue("contents", contents);
      setValue("description", postById.post_desc);
      setValue("benefit", postById.post_benefit);
      setValue("attachments", postById.post_att_file);
      setValue("comment", postById.post_comment as string);
      setValue("files", atrFile);
    }
  }, [postId, posts, setValue]);

  const fetchData = async () => {
    dispatch(FETCH_ALL_USERS_REQUEST());
    const res = await fetchAllUsers(navigate);
    dispatch(FETCH_ALL_USERS_SUCCESS(res));
    return res;
  };

  useEffect(() => {
    if (!isFetchingPosts) {
      fetchData();
      dispatch(fetchPosts(navigate));
    }
  }, []);

  useEffect(() => {
    onStart();
  }, [onStart]);

  const onSubmit = async (data: PostManagementFormProps) => {
    const postById = posts.find((post: any) => post.id === postId);

    const post = {
      id: postId,
      post_format: postById ? postById.post_format : "",
      post_title: data.title,
      post_ctg_id: data.category,
      post_date: data.date,
      post_type: data.type,
      post_prefix_name: nowType === "2" ? "" : data.prefixName,
      post_fname: nowType === "2" ? "" : data.fname,
      post_lname: nowType === "2" ? "" : data.lname,
      post_position: nowType === "2" ? "" : data.position,
      post_depm: nowType === "2" ? "" : data.department,
      post_sub_depm: nowType === "2" ? "" : data.sub_department,
      post_contents: JSON.stringify(data.contents),
      post_desc: data.description,
      post_benefit: data.benefit,
      post_att_file: data.attachments,
      post_publish: postById ? postById.post_publish : "0",
      post_comment: data.comment,
      post_create_by: currentUser?.employeeID as string,
      files: data.files,
      post_count: postById ? postById.post_count : 0,
    };

    try {
      const response = await addPost(post);
      if (response.status != "error") {
        postId
          ? message.success("แบบฟอร์มถูกแก้ไขเรียบร้อยแล้ว")
          : message.success("แบบฟอร์มถูกบันทึกเรียบร้อยแล้ว");
        reset();
        navigate("/management");
        return response;
      } else {
        message.error("เกิดข้อผิดพลาดในการยื่นแบบฟอร์ม");
      }
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล");
      console.error(error);
    }
  };

  const handleBack = () => {
    if (isAdmin) {
      navigate("/management");
    } else {
      navigate("/");
    }
  };

  const findLabelByKey = (
    nodes: CategoryTreeNode[],
    key: string,
    path: string[] = []
  ): string | null => {
    for (const node of nodes) {
      const newPath = [...path, node.title];

      if (node.key === key) {
        return newPath.join("/");
      }

      if (node.children && node.children.length > 0) {
        const result = findLabelByKey(node.children, key, newPath);
        if (result) return result;
      }
    }

    return null;
  };

  return (
    <>
      <div className="tw-mb-4">
        <Divider
          orientation="left"
          orientationMargin="0"
          className="!tw-text-xl !tw-text-primary !tw-font-bold !tw-border-primary"
        >
          แบบฟอร์มบันทึกองค์ความรู้องค์กร
        </Divider>
      </div>
      <Card>
        <div className="tw-grid tw-grid-cols-12 tw-gap-6">
          <div className="tw-col-span-12 tw-flex tw-flex-col tw-justify-center tw-items-center">
            <p>แบบฟอร์มบันทึกองค์ความรู้องค์กร</p>
            <p>(Organization Knowledge Recording Form)</p>
          </div>

          {postId && (
            <div className="tw-col-span-12">
              <div className="tw-flex tw-flex-row tw-justify-end tw-space-x-2">
                <p>เลขที่เอกสาร</p>
                <span className="tw-text-gray-500">
                  {posts.find((item) => item.id === postId)?.post_format}
                </span>
              </div>
            </div>
          )}

          <div className="tw-col-span-12">
            <p className="tw-font-bold tw-pb-4">ส่วนที่ 1 : ข้อมูลทั่วไป</p>
            <div className="tw-grid tw-grid-cols-12 tw-gap-4">
              <div className="tw-col-span-12 md:tw-col-span-8">
                1. ชื่อเรื่ององค์ความรู้
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="ชื่อเรื่ององค์ความรู้" />
                  )}
                />
                {errors.title && (
                  <div className="tw-text-red-500">{errors.title.message}</div>
                )}
              </div>
              <div className="tw-col-span-12 md:tw-col-span-4">
                วันที่
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="วันที่" type="date" />
                  )}
                />
                {errors.date && (
                  <div className="tw-text-red-500">{errors.date.message}</div>
                )}
              </div>
              <div className="tw-col-span-12">
                หมวดหมู่
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <TreeSelect
                      {...field}
                      className="tw-w-full"
                      treeData={categories}
                      fieldNames={{
                        label: "title",
                        value: "key",
                        children: "children",
                      }}
                      labelInValue
                      value={
                        field.value
                          ? {
                              label: findLabelByKey(categories, field.value),
                              value: field.value,
                            }
                          : undefined
                      }
                      onChange={(val) => {
                        field.onChange(val?.value);
                      }}
                      placeholder="เลือกหมวดหมู่"
                      allowClear
                      treeDefaultExpandAll
                      dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                    />
                  )}
                />
                {errors.category && (
                  <div className="tw-text-red-500">
                    {errors.category.message}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="tw-col-span-12">
            <div className="tw-grid tw-grid-cols-12 tw-gap-4">
              <div className="tw-col-span-12 md:tw-col-span-2">
                <p>2. ประเภทขององค์ความรู้</p>
              </div>
              <div className="tw-col-span-10">
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Radio.Group
                      {...field}
                      className="tw-flex tw-flex-col"
                      options={[
                        {
                          label:
                            "ความรู้จากการปฏิบัติงาน (ระบุบข้อมูลในข้อที่ 3 และส่วนที่ 2 ทุกข้อ)",
                          value: "1",
                        },
                        {
                          label:
                            "ความรู้จากการเข้าอบรม  (ระบุบข้อมูลในส่วนที่ 2 ทุกข้อ)",
                          value: "2",
                        },
                      ]}
                    />
                  )}
                />
                {errors.type && (
                  <div className="tw-text-red-500">{errors.type.message}</div>
                )}
              </div>
            </div>
          </div>

          <div className="tw-col-span-12">
            <div className="tw-grid tw-grid-cols-12 tw-gap-4">
              <div className="tw-col-span-12">
                <p>3. ชื่อผู้บันทึก/เจ้าขององค์ความรู้</p>
              </div>
              <div className="tw-col-span-12 md:tw-col-span-2">
                <Controller
                  name="prefixName"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      className="tw-w-full"
                      placeholder="คำนำหน้าชื่อ"
                      options={[
                        { value: "นาย", label: "นาย" },
                        { value: "นาง", label: "นาง" },
                        { value: "นางสาว", label: "นางสาว" },
                      ]}
                      disabled={nowType === "2" ? true : false}
                    />
                  )}
                />
                {errors.prefixName && (
                  <div className="tw-text-red-500">
                    {errors.prefixName.message}
                  </div>
                )}
              </div>
              <div className="tw-col-span-12 md:tw-col-span-5">
                <Controller
                  name="fname"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="ชื่อ"
                      disabled={nowType === "2" ? true : false}
                    />
                  )}
                />
                {errors.fname && (
                  <div className="tw-text-red-500">{errors.fname.message}</div>
                )}
              </div>
              <div className="tw-col-span-12 md:tw-col-span-5">
                <Controller
                  name="lname"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="นามสกุล"
                      disabled={nowType === "2" ? true : false}
                    />
                  )}
                />
                {errors.lname && (
                  <div className="tw-text-red-500">{errors.lname.message}</div>
                )}
              </div>
              <div className="tw-col-span-12 md:tw-col-span-4">
                <Controller
                  name="position"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="ตำแหน่ง"
                      disabled={nowType === "2" ? true : false}
                    />
                  )}
                />
                {errors.position && (
                  <div className="tw-text-red-500">
                    {errors.position.message}
                  </div>
                )}
              </div>
              <div className="tw-col-span-12 md:tw-col-span-4">
                <Controller
                  name="department"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="แผนก"
                      disabled={nowType === "2" ? true : false}
                    />
                  )}
                />
                {errors.department && (
                  <div className="tw-text-red-500">
                    {errors.department.message}
                  </div>
                )}
              </div>
              <div className="tw-col-span-12 md:tw-col-span-4">
                <Controller
                  name="sub_department"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="ฝ่าย"
                      disabled={nowType === "2" ? true : false}
                    />
                  )}
                />
                {errors.sub_department && (
                  <div className="tw-text-red-500">
                    {errors.sub_department.message}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="tw-col-span-12">
            <p className="tw-font-bold tw-pb-4">
              ส่วนที่ 2 : เนื้อหาขององค์ความรู้
            </p>
            <div className="">
              4. ประเภทขององค์ความรู้ (เลือกได้มากกว่า 1 ข้อ)
            </div>
            <div className="tw-flex tw-flex-col md:tw-ml-12">
              <Controller
                name="contents"
                control={control}
                render={({ field }) => (
                  <div className="tw-flex tw-flex-col">
                    {typeKM.map((item) => (
                      <Checkbox
                        key={item.value}
                        checked={(field.value || []).includes(item.value)}
                        onChange={(e) => {
                          const value = e.target.checked
                            ? [...(field.value || []), item.value]
                            : (field.value || []).filter(
                                (v) => v !== item.value
                              );
                          field.onChange(value);
                        }}
                      >
                        {item.label}
                      </Checkbox>
                    ))}
                  </div>
                )}
              />
            </div>
          </div>

          <div className="tw-col-span-12">
            <p>5. รายละเอียดขององค์ความรู้</p>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextEditor
                  onChange={field.onChange}
                  value={field.value || ""}
                  ref={field.ref}
                />
              )}
            />
          </div>

          <div className="tw-col-span-12">
            <p>6. ประโยชน์ขององค์ความรู้</p>
            <Controller
              name="benefit"
              control={control}
              render={({ field }) => (
                <TextEditor
                  onChange={field.onChange}
                  value={field.value || ""}
                  ref={field.ref}
                />
              )}
            />
          </div>

          <div className="tw-col-span-12">
            <p>7. เอกสาร/ไฟล์แนบ (ถ้ามี)</p>
            <Controller
              name="attachments"
              control={control}
              render={({ field }) => (
                <Radio.Group
                  {...field}
                  className="tw-flex tw-flex-col md:tw-ml-12"
                  options={[
                    { label: `มี  เอกสารแนบ/ภาพประกอบ`, value: "1" },
                    { label: "ไม่มี", value: "0" },
                  ]}
                />
              )}
            />
            {errors.attachments && (
              <div className="tw-text-red-500">
                {errors.attachments.message}
              </div>
            )}
          </div>

          {watch("attachments") === "1" && (
            <div className="tw-col-span-12">
              <p className="tw-font-medium">อัปโหลดไฟล์</p>
              <Controller
                name="files"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FileUpload onChange={onChange} value={value} />
                )}
              />
            </div>
          )}

          <div className="tw-col-span-12">
            <p className="tw-font-bold tw-pb-4">ส่วนที่ 3 : อื่นๆ </p>
            <p>8. เสนอความเห็นโดยหัวหน้างาน / ผู้จัดการฝ่ายต้นสังกัด</p>
            <Controller
              name="comment"
              control={control}
              render={({ field }) => (
                <TextArea
                  {...field}
                  rows={4}
                  placeholder="เสนอความเห็นโดยหัวหน้างาน / ผู้จัดการฝ่ายต้นสังกัด"
                />
              )}
            />
          </div>
        </div>

        <div className="tw-w-full tw-flex tw-justify-end tw-mt-4 tw-space-x-2">
          <Button
            type="primary"
            onClick={handleSubmit(onSubmit)}
            className="tw-w-24 tw-bg-primary"
          >
            บันทึก
          </Button>
          {postId && (
            <Button
              variant="outlined"
              onClick={handleBack}
              className="tw-w-24 tw-border-primary"
            >
              ยกเลิก
            </Button>
          )}
        </div>
      </Card>

      {postId && (
        <div className="tw-flex tw-flex-col tw-mt-2 tw-space-y-1">
          <div className="tw-flex tw-flex-row tw-space-x-1 tw-text-gray-500 tw-text-xs">
            <p>เรียบเรียงโดย :</p>
            <span>
              {(() => {
                const post = posts.find((p) => p.id === postId);
                const authorID = post?.post_create_by;
                const matchedUser = allUsers.find(
                  (user) => user.employeeID === authorID
                );
                return matchedUser
                  ? `${matchedUser.firstName} ${matchedUser.lastName}`
                  : "ไม่พบข้อมูล";
              })()}
            </span>
          </div>
          <div className="tw-flex tw-flex-row tw-space-x-1 tw-text-gray-500 tw-text-xs">
            <p>อัพเดทล่าสุดวันที่ :</p>
            <span>
              {posts.find((item) => item.id === postId)?.post_update_at}
            </span>
          </div>
        </div>
      )}
    </>
  );
};
