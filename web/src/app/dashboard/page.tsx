"use client";

import * as React from "react";
import { useState } from "react";
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, Tooltip, MenuItem } from "@mui/material";
import { Menu as MenuIcon, Adb as AdbIcon } from "@mui/icons-material";

// ページと対応するコンポーネントのインポート
import InventoryListPage from "../dashboard_components/inventorylist/page";
import OrderHistoryPage from "../dashboard_components/orderhistory/page";
import OrderStatusPage from "../dashboard_components/orderstatus/page";
import NotificationSettingsPage from "../dashboard_components/notificationsettings/page";

// ページ情報
const pages = [
    { label: "在庫一覧", component: <InventoryListPage /> },
    { label: "発注履歴", component: <OrderHistoryPage /> },
    { label: "発注ステータス", component: <OrderStatusPage /> },
    { label: "通知設定", component: <NotificationSettingsPage /> },
];
const settings = ["ログアウト"];

export default function ResponsiveAppBar() {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [activeTab, setActiveTab] = useState(0);

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
    // クリックしたメニューの状態管理追加
    const handleTabClick = (index: number) => {
        setActiveTab(index);
        handleCloseNavMenu();
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

                        <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                            <IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleOpenNavMenu} color="inherit">
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "left",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "left",
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{ display: { xs: "block", md: "none" } }}
                            >
                                {pages.map((page, index) => (
                                    <MenuItem key={page.label} onClick={() => handleTabClick(index)}>
                                        <Typography textAlign="center">{page.label}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>

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
                        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                            {pages.map((page, index) => (
                                <Button key={page.label} onClick={() => handleTabClick(index)} sx={{ my: 2, color: "white", display: "block" }}>
                                    {page.label}
                                </Button>
                            ))}
                        </Box>
                        {/* アカウントアイコン */}
                        <Box sx={{ flexGrow: 0 }}>
                            <Button
                                color="inherit"
                                onClick={handleOpenUserMenu}
                                sx={{
                                    fontSize: {
                                        xs: "0.7rem",
                                        sm: "0.8rem",
                                        md: "0.9rem",
                                    },
                                }}
                            >
                                ログイン中アカウント
                            </Button>
                            <Menu
                                sx={{ mt: "45px" }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                        <Typography sx={{ textAlign: "center" }}>{setting}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            {/* 選択されたページコンポーネントを表示 */}
            <Container sx={{ mt: 4 }}>{pages[activeTab].component}</Container>
        </>
    );
}
