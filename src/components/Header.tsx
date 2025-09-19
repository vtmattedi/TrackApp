import React, { useEffect } from 'react';

import { ChevronDown, ChevronUp, LayoutDashboard, Menu } from 'lucide-react';
import { Map as MapIcon2 } from 'lucide-react';
import {
    Popover,
    PopoverAnchor,
    PopoverContent,
} from "@/components/ui/popover"
import { Button } from './ui/button';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import ThemeSelector from './ThemeSelector';
import { useNavigate } from 'react-router-dom';
import { useGlobals } from '@/Providers/GlobalCtx';


const Header: React.FC = () => {
    const [popoverOpen, setPopoverOpen] = React.useState(false);
    const [sheetOpen, setSheetOpen] = React.useState(false);
    const pagesClass = "text-[var(--color-accent-trackfy)] dark:text-white hover:text-[var(--color-accent-trackfy-hover)] dark:hover:text-gray-300 hover:cursor-pointer hover:underline hover:underline-offset-4 p-4 flex items-center gap-2 text-lg font-medium";
    const getPlanColor = (plan: string | undefined) => {
        switch (plan?.toLowerCase()) {
            case 'bronze':
                return 'text-yellow-800 dark:text-yellow-400';
            case 'silver':
                return 'text-gray-500 dark:text-gray-400';
            case 'gold':
                return 'text-yellow-500 dark:text-yellow-400    ';
            case 'platinum':
                return 'text-blue-500 dark:text-blue-400';
            default:
                return 'text-gray-500 dark:text-gray-400';
        }
    }
    const navigate = useNavigate();
    const Pages = [
        { name: 'Dashboard', icon: <LayoutDashboard />, link: '/', aria: 'Navigate to dashboard view' },
        { name: 'Mapa', icon: <MapIcon2 />, link: '/map', aria: 'Navigate to map view' },
    ]

    const { user, onMobile, logout  } = useGlobals();
    useEffect(() => {
        // If we don't have a user, redirect to login
        // Should be handled in the backend to
        if (!user){
            navigate('/login');
        }
    }, [user]);
    return (
        <div
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 9999,
                backdropFilter: 'saturate(180%) blur(20px)',
            }}
        className="bg-[var(--header-bg)] w-full  flex justify-between items-center position-sticky top-0 z-999 shadow-md w-full h-[64px]" >
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverAnchor asChild>
                    <div className="flex items-center  hover:bg-gray-700 hover:cursor-pointer p-4 border-round h-full"
                     onClick={() => {
                        setPopoverOpen((prev) => !prev);
                    }} >
                        <img src={user?.avatarUrl} alt={user?.name} className="h-12 w-12 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                        <div className="flex flex-col">
                            <span className="ml-2">{user?.name}</span>
                            <span className={`ml-2 text-sm ${getPlanColor(user?.plan)}`}>Conta {user?.plan}</span>
                        </div>

                        {
                            popoverOpen ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                        }
                    </div>
                </PopoverAnchor>
                <PopoverContent className="ml-1 mt-0" style={{ zIndex: 10000 }}>
                    <div className="flex flex-col  " >
                        <span className="font-bold">{user?.name}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Plan: {user?.plan}</span>
                        {
                            user?.plan.toLowerCase() !== 'platinum' ? (
                                <Button variant="default" className='hover:cursor-pointer'>Upgrade</Button>

                            ) : null
                        }
                        <Button variant="outline" className='border-red-500 hover:bg-red-500 hover:text-white hover:cursor-pointer'
                            onClick={logout}
                        >Logout</Button>
                    </div>

                </PopoverContent>

            </Popover>
            {
                // not mobile view
                !onMobile ? (
                    <>
                        <div className="flex items-center">
                            {Pages.map((page) => (
                                <div
                                    key={page.name}
                                    aria-label={page.aria}
                                    style={{
                                        fontWeight: window.location.pathname === page.link ? '700' : '300',
                                    }}
                                    className={`${pagesClass} `}
                                    onClick={() => navigate(page.link)}
                                >
                                    {page.icon} {page.name}
                                </div>
                            ))}
                        </div>
                        <ThemeSelector />
                            
                    </>
                ) : (

                    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                        <SheetTrigger asChild >
                            <div className="flex items-center p-4 hover:cursor-pointer hover:text-gray-500 border-round">
                                <Menu />
                            </div>
                        </SheetTrigger>
                        <SheetContent className='z-9999 bg-[var(--header-bg)]' side='right'
                            style={{
                                transition: 'transform 0.3s ease-in-out',
                            }}
                        >
                            <div className="flex justify-between items-center border-b p-3 mb-4">
                                <span className="font-bold text-lg font-lato">Menu</span>
                                <ThemeSelector />
                            </div>

                            <div className="flex flex-col ">
                                {Pages.map((page) => (
                                    <div
                                        key={page.name}
                                        onClick={() => { navigate(page.link); setSheetOpen(false); }}
                                        aria-label={page.aria}
                                        style={{
                                            padding: '1',
                                            // color: window.location.pathname === page.link ? 'var(--color-accent-trackfy)' : undefined,
                                            fontWeight: window.location.pathname === page.link ? '700' : '300',
                                        }}
                                        className={`${pagesClass} p-0`}
                                    >
                                        {page.icon} <span>{page.name}</span>
                                    </div>
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>

                )
            }


        </div>
    );
};

export default Header;