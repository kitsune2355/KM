import {
  createSlice,
  PayloadAction,
  configureStore,
  createSelector,
} from "@reduxjs/toolkit";

export interface CategoryTreeNode {
  id?: string;
  title: string;
  key: string;
  children?: CategoryTreeNode[];
  parent_key: string | null;
  parentId?: string | null;
  path?: string;
}

interface CategoryState {
  categories: CategoryTreeNode[];
  isFetching: boolean;
}

const initialState: CategoryState = {
  categories: [],
  isFetching: false,
};

const addChildToTreeRecursive = (
  data: CategoryTreeNode[],
  parentKey: string,
  child: CategoryTreeNode
): CategoryTreeNode[] => {
  return data.map((node) => {
    if (node.key === parentKey) {
      // เพิ่ม child ใน parent ที่ตรงกับ parentKey
      return {
        ...node,
        children: [...(node.children || []), child],
      };
    } else if (node.children) {
      // ถ้ามี children ให้ทำการหาซ้ำ recursive
      return {
        ...node,
        children: addChildToTreeRecursive(node.children, parentKey, child),
      };
    }
    return node;
  });
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    FETCH_CATEGORIES_REQUEST: (state) => {
      state.isFetching = true;
    },
    FETCH_CATEGORIES_SUCCESS: (
      state,
      action: PayloadAction<CategoryTreeNode[]>
    ) => {
      state.categories = action.payload;
      state.isFetching = false;
    },
    FETCH_CATEGORIES_FAILURE: (state, action: PayloadAction<string>) => {
      state.isFetching = false;
      console.error(action.payload);
    },
    ADD_CATEGORY: (state, action: PayloadAction<CategoryTreeNode>) => {
      const newCategory = action.payload;
      if (newCategory.parent_key) {
        // ถ้ามี parent_key ต้องหาที่ parent นั้น
        state.categories = addChildToTreeRecursive(
          state.categories,
          newCategory.parent_key,
          newCategory
        );
      } else {
        // ถ้าไม่มี parent_key ให้เพิ่มเป็น root node
        state.categories.push(newCategory);
      }
    },
    DELETE_CATEGORY: (state, action: PayloadAction<string>) => {
      const deleteKey = action.payload;
      const deleteNodeRecursive = (data: CategoryTreeNode[], key: string) => {
        return data.reduce(
          (acc: CategoryTreeNode[], node: CategoryTreeNode) => {
            if (node.key === key) return acc; // ไม่เพิ่ม node ที่ต้องการลบ
            if (node.children) {
              node.children = deleteNodeRecursive(node.children, key);
            }
            acc.push(node);
            return acc;
          },
          []
        );
      };
      state.categories = deleteNodeRecursive(state.categories, deleteKey);
    },
    UPDATE_CATEGORY: (state, action: PayloadAction<CategoryTreeNode>) => {
      const updatedCategory = action.payload;

      const updateCategoryRecursive = (
        data: CategoryTreeNode[],
        updated: CategoryTreeNode
      ): CategoryTreeNode[] => {
        return data.map((node) => {
          if (node.key === updated.key) {
            return {
              ...node,
              title: updated.title,
              parent_key: updated.parent_key,
            };
          } else if (node.children) {
            return {
              ...node,
              children: updateCategoryRecursive(node.children, updated),
            };
          }
          return node;
        });
      };

      state.categories = updateCategoryRecursive(
        state.categories,
        updatedCategory
      );
    },
    FETCH_CATEGORY: (state, action: PayloadAction<CategoryTreeNode[]>) => {
      state.isFetching = true;
      state.categories = action.payload;
    },
  },
});

export const {
  FETCH_CATEGORIES_REQUEST,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_CATEGORIES_FAILURE,
  ADD_CATEGORY,
  DELETE_CATEGORY,
  UPDATE_CATEGORY,
  FETCH_CATEGORY,
} = categorySlice.actions;

export const categoryReducer = categorySlice.reducer;

export const store = configureStore({
  reducer: {
    categories: categoryReducer,
  },
});

export const selectCategoryState = createSelector(
  (state: RootState) => state.categories,
  (category) => ({
    categories: category.categories,
    isFetchingCategory: category.isFetching,
  })
);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
