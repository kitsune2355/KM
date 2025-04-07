import { UserOutlined } from "@ant-design/icons";
import { Avatar, Card } from "antd";
import React from "react";

export const PostContentScreen: React.FC = () => {
  return (
    <Card>
      <div className="tw-flex tw-flex-row tw-items-center">
        <Avatar size={48} icon={<UserOutlined />} />
        <div className="tw-flex tw-flex-col tw-ml-4">
          <p>Name Surname</p>
          <p>
            position <span>2023-05-24</span>
          </p>
        </div>
      </div>
      <div className="tw-mt-4 tw-flex tw-flex-col tw-space-y-4">
        <h1 className="tw-text-xl tw-text-black tw-font-bold">Post Content</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus sit
          asperiores autem vel maxime pariatur numquam deleniti quis sapiente,
          magni sint commodi! Corporis veniam voluptatum quasi perferendis sit
          sed veritatis? Lorem ipsum dolor sit amet consectetur, adipisicing
          elit. Consectetur exercitationem voluptatibus expedita non debitis
          sapiente in pariatur? Aliquid error consequatur minima dolorum rem
          modi iure explicabo quod nisi laudantium? Inventore? Lorem ipsum dolor
          sit, amet consectetur adipisicing elit. Rem cum hic magnam animi
          pariatur eum saepe esse beatae, veniam, illo consequuntur quo neque
          sit, voluptates quidem magni nisi tempora. Praesentium. Lorem ipsum
          dolor sit amet consectetur adipisicing elit. Suscipit, officiis nisi
          quae dolorem quia aliquid tempore rem odio dignissimos nihil ex ea
          corporis quam? Fugiat inventore ipsam tempore tempora totam. Lorem
          ipsum dolor sit amet consectetur adipisicing elit. Ipsa quas quod eius
          quidem ratione, nobis sunt asperiores laborum atque pariatur corrupti
          est, quos unde, error eum soluta placeat labore commodi. Lorem ipsum
          dolor sit amet consectetur adipisicing elit. Sed consequuntur
          voluptates fuga incidunt expedita laborum illo rem at, ipsum excepturi
          quo reiciendis unde soluta ea sapiente pariatur libero architecto!
          Doloribus?
        </p>
      </div>
    </Card>
  );
};
