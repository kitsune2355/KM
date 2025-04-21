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

const typeKnowledge = [
  {
    label: "ความรู้จากการปฏิบัติงาน",
    value: "ความรู้จากการปฏิบัติงาน",
  },
  {
    label: "ความรู้จากการเข้าอบรม",
    value: "ความรู้จากการเข้าอบรม",
  },
];

const typeKM = [
  {
    label: "แนวทาง/กระบวนการในการปฏิบัติงาน",
    value: "1",
  },
  {
    label: "วิธีการแก้ไขปัญหา",
    value: "2",
  },
  {
    label: "ข้อเสนอแนะเพื่อการพัฒนา/ประยุกต์ใช้",
    value: "3",
  },
  {
    label: "บทเรียนที่ได้รับจากความสำเร็จ",
    value: "4",
  },
  {
    label: "บทเรียนที่ได้รับจากความล้มเหลว",
    value: "5",
  },
  {
    label: "ความรู้เชิงเทคนิคหรือความเชี่ยวชาญเฉพาะด้าน",
    value: "6",
  },
];

export const PostManagementScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const posts = useSelector((state: RootState) => state.posts.posts);
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
      setValue("contents", postById.post_contents);
      setValue("description", postById.post_desc);
      setValue("benefit", postById.post_benefit);
      setValue("attachments", postById.post_att_file);
      setValue("comment", postById.post_comment as string);
      setValue("files", atrFile);
    }
  }, [postId, posts, setValue]);

  useEffect(() => {
    if (!posts || posts.length === 0) {
      dispatch(fetchPosts());
    }
  }, [posts]);

  useEffect(() => {
    onStart();
  }, [onStart]);

  const onSubmit = async (data: PostManagementFormProps) => {
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
    const postById = posts.find((post: any) => post.id === postId);

    const post = {
      id: postId,
      post_title: data.title,
      post_ctg_id: data.category,
      post_date: data.date,
      post_type: data.type,
      post_prefix_name: data.prefixName,
      post_fname: data.fname,
      post_lname: data.lname,
      post_position: data.position,
      post_depm: data.department,
      post_sub_depm: data.sub_department,
      post_contents: data.contents,
      post_desc: data.description,
      post_benefit: data.benefit,
      post_att_file: data.attachments,
      post_publish: postById ? postById.post_publish : "0",
      post_comment: data.comment,
      post_create_by: user[0].id,
      files: data.files,
    };

    try {
      const response = await addPost(post);
      if (postId) {
        message.success("แบบฟอร์มถูกแก้ไขเรียบร้อยแล้ว");
      } else {
        message.success("แบบฟอร์มถูกบันทึกเรียบร้อยแล้ว");
      }
      reset();
      navigate("/management");
      return response;
    } catch (error) {
      message.error("เกิดข้อผิดพลาดในการยื่นแบบฟอร์ม");
      console.error(error);
    }
  };

  const onError = (errors: any) => {
    console.log("Form Errors", errors);
  };

  const handleBack = () => {
    if (isAdmin) {
      navigate("/management");
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <div className="tw-mb-4">
        <Divider
          orientation="left"
          orientationMargin="0"
          className="!tw-text-xl !tw-text-primary !tw-font-bold"
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
                      options={typeKnowledge}
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
                    <Input {...field} placeholder="ชื่อ" />
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
                    <Input {...field} placeholder="นามสกุล" />
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
                    <Input {...field} placeholder="ตำแหน่ง" />
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
                    <Input {...field} placeholder="แผนก" />
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
                    <Input {...field} placeholder="ฝ่าย" />
                  )}
                />
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
                <TextArea
                  {...field}
                  rows={4}
                  placeholder="รายละเอียดขององค์ความรู้"
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
                <TextArea
                  {...field}
                  rows={4}
                  placeholder="ประโยชน์ขององค์ความรู้"
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
            onClick={handleSubmit(onSubmit, onError)}
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
    </>
  );
};
