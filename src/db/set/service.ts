import type { SetRecord, SetReport } from "@db/set/types";

export async function reportSet(set_report: SetReport): Promise<SetReport> {}
export async function getSets(user_id: string): Promise<Array<SetRecord>> {}
export async function getSetsNLast(user_id: string, n: number): Promise<Array<SetRecord>> {}
export async function getSetsDateRange(
    user_id: string,
    start: string,
    end: string,
): Promise<Array<SetRecord>> {}

// Will likely require some sort of computed columns w/ separate table?
export async function getPoints(user_id: string): Promise<number> {};
export async function getLeaderboard(tier: number): Promise<Array<string>> {}
