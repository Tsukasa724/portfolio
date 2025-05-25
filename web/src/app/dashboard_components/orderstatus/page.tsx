"use client";

import * as React from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Stack } from "@mui/material";

interface OrderStatusPageProps {
    userRole: string | null;
}

interface Column {
    id: "name" | "status" | "today";
    label: string;
    minWidth?: number;
    align?: "right";
    format?: (value: number) => string;
}

const columns: readonly Column[] = [
    { id: "name", label: "名前", minWidth: 170 },
    {
        id: "status",
        label: "発注ステータス",
        minWidth: 170,
        align: "right",
        format: (value: number) => value.toLocaleString("en-US"),
    },
    {
        id: "today",
        label: "現在日時",
        minWidth: 170,
        align: "right",
        format: (value: number) => value.toLocaleString("en-US"),
    },
];

// データ作成用の関数
function createData(name: string, status: string, today: string) {
    return { name, status, today };
}

// データの配列（行データ）
const rows = [
    createData("India", "正常", "日時"),
    createData("China", "正常", "日時"),
    createData("Italy", "正常", "日時"),
    createData("United States", "正常", "日時"),
    createData("Canada", "正常", "日時"),
    createData("Australia", "正常", "日時"),
    createData("Germany", "正常", "日時"),
    createData("Ireland", "正常", "日時"),
    createData("Mexico", "正常", "日時"),
    createData("Japan", "正常", "日時"),
    createData("France", "正常", "日時"),
    createData("United Kingdom", "正常", "日時"),
    createData("Russia", "正常", "日時"),
    createData("Nigeria", "正常", "日時"),
    createData("Brazil", "正常", "日時"),
];

export default function OrderStatusPage({ userRole }: OrderStatusPageProps) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
                            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.name}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
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
                <TablePagination rowsPerPageOptions={[10, 25, 100]} component="div" count={rows.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} />
            </Paper>
        </Stack>
    );
}
