"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Button, MenuItem } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { UserAuth } from "../../../lib/auth";

// ページコンポーネントのインポート
import InventoryListPage from "../dashboard_components/inventorylist/page";
import OrderHistoryPage from "../dashboard_components/orderhistory/page";
import OrderStatusPage from "../dashboard_components/orderstatus/page";
import UseStockPage from "../dashboard_components/usestock/page";
import AddStockPage from "../dashboard_components/addstock/page";
import NotificationSettingsPage from "../dashboard_components/notificationsettings/page";

// ページ情報（通知設定は除外）
const pages = [
    { label: "在庫一覧", component: <InventoryListPage /> },
    { label: "発注履歴", component: <OrderHistoryPage /> },
    { label: "発注ステータス", component: <OrderStatusPage /> },
    { label: "在庫使用", component: <UseStockPage /> },
    { label: "在庫追加", component: <AddStockPage /> },
];

// 設定メニュー
const settings = [
    { label: "在庫不足", component: <NotificationSettingsPage /> },
    { label: "ログアウト", component: null },
];

export default function ResponsiveAppBar() {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [activeTabComponent, setActiveTabComponent] = useState<React.ReactNode>(pages[0].component);
    const [userRole, setUserRole] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const role = UserAuth.getUserRole();
        console.log("取得した userRole:", role);
        setUserRole(role);
    }, []);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleTabClick = (index: number) => {
        setActiveTabComponent(pages[index].component);
        handleCloseNavMenu();
    };

    const handleSettingClick = (setting: (typeof settings)[0]) => {
        handleCloseUserMenu();

        if (setting.component) {
            setActiveTabComponent(setting.component);
        } else if (setting.label === "ログアウト") {
            // アクセストークンを削除
            localStorage.removeItem("access_token");

            // トップページにリダイレクト
            router.push("/");

            // 必要に応じて、認証状態のリセット処理を入れる
            console.log("ログアウトしました");
        }
    };

    return (
        <>
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/dashboard"
                            sx={{
                                mr: 2,
                                display: { xs: "none", md: "flex" },
                                fontFamily: "monospace",
                                fontWeight: 700,
                                letterSpacing: ".3rem",
                                color: "inherit",
                                textDecoration: "none",
                                fontSize: {
                                    md: "1.2rem",
                                    lg: "1.5rem",
                                    xl: "1.8rem",
                                },
                            }}
                        >
                            在庫管理システム
                        </Typography>

                        {/* モバイル用メニュー */}
                        <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                            <IconButton size="large" onClick={handleOpenNavMenu} color="inherit">
                                <MenuIcon />
                            </IconButton>
                            <Menu anchorEl={anchorElNav} open={Boolean(anchorElNav)} onClose={handleCloseNavMenu} anchorOrigin={{ vertical: "bottom", horizontal: "left" }} transformOrigin={{ vertical: "top", horizontal: "left" }} sx={{ display: { xs: "block", md: "none" } }}>
                                {pages.map((page, index) => (
                                    <MenuItem key={page.label} onClick={() => handleTabClick(index)}>
                                        <Typography textAlign="center">{page.label}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>

                        {/* モバイル時のタイトル */}
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href="/dashboard"
                            sx={{
                                mr: 2,
                                display: { xs: "flex", md: "none" },
                                flexGrow: 1,
                                fontFamily: "monospace",
                                fontWeight: 700,
                                letterSpacing: ".3rem",
                                color: "inherit",
                                textDecoration: "none",
                                fontSize: {
                                    xs: "1rem",
                                    sm: "1.2rem",
                                },
                            }}
                        >
                            在庫管理システム
                        </Typography>

                        {/* メニュータブ */}
                        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                            {pages.map((page, index) => (
                                <Button key={page.label} onClick={() => handleTabClick(index)} sx={{ my: 2, color: "white" }}>
                                    {page.label}
                                </Button>
                            ))}
                        </Box>

                        {/* ユーザーメニュー */}
                        <Box sx={{ flexGrow: 0 }}>
                            <Button color="inherit" onClick={handleOpenUserMenu}>
                                {userRole || "アカウント"}
                            </Button>
                            <Menu anchorEl={anchorElUser} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}>
                                {settings.map((setting) =>
                                    setting.label === "在庫不足" && userRole !== "manager" ? null : (
                                        <MenuItem key={setting.label} onClick={() => handleSettingClick(setting)}>
                                            <Typography textAlign="center">{setting.label}</Typography>
                                        </MenuItem>
                                    )
                                )}
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* 表示されるコンテンツ */}
            <Container sx={{ mt: 4 }}>{activeTabComponent}</Container>
        </>
    );
}
