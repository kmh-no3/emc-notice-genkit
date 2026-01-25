import { create } from "zustand";
import { nanoid } from "nanoid";
import type { Header, Notify, Item } from "@/lib/densai/schema";

interface NoticeStore {
  header: Header;
  notify: Notify;
  items: Item[];
  selectedItemId: string | null;
  
  // ヘッダー操作
  setHeader: (header: Partial<Header>) => void;
  
  // 通知先操作
  setNotify: (notify: Partial<Notify>) => void;
  
  // 明細操作
  addItem: () => void;
  updateItem: (id: string, item: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  duplicateItem: (id: string) => void;
  selectItem: (id: string | null) => void;
  
  // リセット
  reset: () => void;
}

const initialHeader: Header = {
  bukrs: "",
  belnr: "",
  gjahr: "",
  budat: undefined,
  irainin_ref_no: undefined,
};

const initialNotify: Notify = {
  ginko_cd: undefined,
  shiten_cd: undefined,
  koza_no: undefined,
  koza_mei: undefined,
};

export const useNoticeStore = create<NoticeStore>((set) => ({
  header: { ...initialHeader },
  notify: { ...initialNotify },
  items: [],
  selectedItemId: null,
  
  setHeader: (partial) =>
    set((state) => ({
      header: { ...state.header, ...partial },
    })),
  
  setNotify: (partial) =>
    set((state) => ({
      notify: { ...state.notify, ...partial },
    })),
  
  addItem: () =>
    set((state) => {
      const newItem: Item = {
        id: nanoid(),
        kingaku: undefined,
        tekiyo: undefined,
        date: undefined,
      };
      return {
        items: [...state.items, newItem],
        selectedItemId: newItem.id,
      };
    }),
  
  updateItem: (id, partial) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...partial } : item
      ),
    })),
  
  deleteItem: (id) =>
    set((state) => {
      const newItems = state.items.filter((item) => item.id !== id);
      const newSelectedId =
        state.selectedItemId === id
          ? newItems.length > 0
            ? newItems[0].id
            : null
          : state.selectedItemId;
      return {
        items: newItems,
        selectedItemId: newSelectedId,
      };
    }),
  
  duplicateItem: (id) =>
    set((state) => {
      const item = state.items.find((i) => i.id === id);
      if (!item) return state;
      const newItem: Item = {
        ...item,
        id: nanoid(),
      };
      return {
        items: [...state.items, newItem],
        selectedItemId: newItem.id,
      };
    }),
  
  selectItem: (id) =>
    set({
      selectedItemId: id,
    }),
  
  reset: () =>
    set({
      header: { ...initialHeader },
      notify: { ...initialNotify },
      items: [],
      selectedItemId: null,
    }),
}));
