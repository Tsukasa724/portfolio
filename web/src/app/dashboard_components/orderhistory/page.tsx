"use client";

import * as React from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Stack } from "@mui/material";

// APIエンドポイントのURLを設定
const API_URL = "http://localhost:8080/dashboard/read_order_history_list";

interface OrderHistoryPageProps {
    userRole: string | null;
}

interface Column {
    id: "name" | "history" | "orderday";
    label: string;
    minWidth?: number;
    align?: "right";
    format?: (value: number) => string;
}

const columns: readonly Column[] = [
    { id: "name", label: "名前", minWidth: 170 },
    {
        id: "history",
        label: "発注履歴",
        minWidth: 170,
        align: "right",
        format: (value: number) => value.toLocaleString("en-US"),
    },
    {
        id: "orderday",
        label: "発注日",
        minWidth: 170,
        align: "right",
        format: (value: number) => value.toLocaleString("en-US"),
    },
];

export default function OrderHistoryPage({ userRole }: OrderHistoryPageProps) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [data, setData] = React.useState<any[]>([]);

    // APIからデータ取得
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const response = await fetch(API_URL, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error("データの取得に失敗しました");
                }
                const result = await response.json();
                console.log(result);
                const formattedData = result.data.map((item: any) => ({
                    name: item.inventory_item.item_name,
                    history: item.history_status,
                    orderday: item.created_at,
                }));
                setData(formattedData);
            } catch (error) {
                console.error("API取得エラー:", error);
            }
        };
        fetchData();
    }, []);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Stack>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.name}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align} sx={column.id === "history" ? (value === "発注完了" ? { color: "green", fontWeight: "bold" } : value === "発注取消" ? { color: "red", fontWeight: "bold" } : {}) : {}}>
                                                    {column.format && typeof value === "number" ? column.format(value) : value}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination rowsPerPageOptions={[10, 25, 100]} component="div" count={data.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} />
            </Paper>
        </Stack>
    );
}
