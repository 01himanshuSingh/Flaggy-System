import { create } from "zustand"

type FlagDialogState = {
  open: boolean
  openDialog: () => void
  closeDialog: () => void
}

export const useFlagDialog = create<FlagDialogState>((set) => ({
  open: false,
  openDialog: () => set({ open: true }),
  closeDialog: () => set({ open: false }),
}))