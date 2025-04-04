import React from "react";
import { KnowledgeCard } from "../../components/KnowledgeCard";

const mockData = [
  {
    title: "Title 1",
    description: "Description 1",
    tags: "Tag 1",
    image: [
      "https://images.unsplash.com/photo-1682685796565-37a626b9399f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1682685796565-37a626b9399f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    ]
  },
  {
    title: "Title 2",
    description:
      "Description 2",
    tags: "Tag 2",
    image: [
      "https://images.unsplash.com/photo-1682685796565-37a626b9399f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1682685796565-37a626b9399f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    ]
  },
  {
    title: "Title 3",
    description: "Description 3",
    tags: "Tag 3",
    image: [
      "https://images.unsplash.com/photo-1682685796565-37a626b9399f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1682685796565-37a626b9399f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    ]
  },
  {
    title: "Title 4",
    description: "Description 4",
    tags: "Tag 4",
    image: [
      "https://images.unsplash.com/photo-1682685796565-37a626b9399f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1682685796565-37a626b9399f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    ]
  },
  {
    title: "Title 5",
    description: "Description 5",
    tags: "Tag 5",
    image: [
      "https://images.unsplash.com/photo-1682685796565-37a626b9399f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1682685796565-37a626b9399f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    ]
  },
];

export const DashboardScreen: React.FC = () => {
  return (
    <div className="tw-container">
      <div className="tw-grid tw-grid-cols-12 tw-gap-4">
        {mockData.map((item, key) => (
          <div className="tw-col-span-12 sm:tw-col-span-6 lg:tw-col-span-4 xl:tw-col-span-3" key={key}>
            <KnowledgeCard
              title={item.title}
              description={item.description}
              tags={item.tags}
              image={item.image}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
