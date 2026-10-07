export type DuplicateBill = { id: string; name: string; accountNumber: string; dueDate: string; amount: number; revision: string };
export type BillConfirmation = Pick<DuplicateBill, "id" | "revision">;
export class DuplicateBillError extends Error {
  constructor(message: string, public duplicate: DuplicateBill, public canUpdate: boolean) { super(message); }
}
export async function withBillConfirmation<T>(save: (confirmation?: BillConfirmation) => Promise<T>, confirm: (bill: DuplicateBill) => Promise<boolean>): Promise<T | null> {
  let confirmation: BillConfirmation | undefined;
  for (;;) {
    try { return await save(confirmation); }
    catch (error) {
      if (!(error instanceof DuplicateBillError) || !error.canUpdate) throw error;
      if (!(await confirm(error.duplicate))) return null;
      confirmation = { id: error.duplicate.id, revision: error.duplicate.revision };
    }
  }
}
