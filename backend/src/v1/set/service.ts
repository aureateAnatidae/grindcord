import type { SetRecord, SetReport } from "@v1/set/types";

export async function reportSet(set_report: SetReport): Promise<SetReport> {}

// Consider some sort of fighly flexible minimal abstraction over SQL so that developer/user can provide any bounds to search in table
export async function getSets(user_id: string): Promise<Array<SetRecord>> {}
export async function getSetsNLast(user_id: string, n: number): Promise<Array<SetRecord>> {}
export async function getSetsDateRange(
    user_id: string,
    start: string,
    end: string,
): Promise<Array<SetRecord>> {}
