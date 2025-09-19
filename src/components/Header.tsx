import React, { useEffect } from 'react';

import { ChevronDown, ChevronUp, LayoutDashboard, Menu, PartyPopper, ThumbsUp } from 'lucide-react';
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
import { useGlobals } from '@/Providers/Globals';
import confetti from 'canvas-confetti';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { useAlert } from '@/Providers/Alerts';
const Header: React.FC = () => {
    const [popoverOpen, setPopoverOpen] = React.useState(false);
    const [sheetOpen, setSheetOpen] = React.useState(false);
    const [showUpgradeAlert, setShowUpgradeAlert] = React.useState(false);
    const { showAlert } = useAlert();
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
    const nextPlan = (plan: string | undefined): "Free" | "Silver" | "Gold" | "Platinum" => {
        switch (plan?.toLowerCase()) {
            case 'free':
                return 'Silver';
            case 'silver':
                return 'Gold';
            case 'gold':
                return 'Platinum';
            case 'platinum':
                return 'Platinum';
            default:
                return 'Silver';
        }
    };
    const navigate = useNavigate();
    const Pages = [
        { name: 'Dashboard', icon: <LayoutDashboard />, link: '/', aria: 'Navigate to dashboard view' },
        { name: 'Mapa', icon: <MapIcon2 />, link: '/map', aria: 'Navigate to map view' },
    ]

    const { user, onMobile, logout, changeUserPlan } = useGlobals();
    useEffect(() => {
        // If we don't have a user, redirect to login
        // Should be handled in the backend to
        if (!user) {
            navigate('/login');
        }
    }, [user]);

    const fireConfetti = () => {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
        const randomInRange = (min: number, max: number) =>
            Math.random() * (max - min) + min;
        const interval = window.setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) {
                return clearInterval(interval);
            }
            const particleCount = 50 * (timeLeft / duration);
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            });
        }, 250);
    };
    const upgradeAccount = () => {

        let newPlan: 'Free' | 'Silver' | 'Gold' | 'Platinum'; //repeat of type def
        //should prob. import to maintain consistency
        switch (user?.plan.toLowerCase() || 'free') {
            case 'free':
                newPlan = 'Silver';
                break;
            case 'bronze':
                newPlan = 'Silver';
                break;
            case 'silver':
                newPlan = 'Gold';
                break;
            case 'gold':
                newPlan = 'Platinum';
                break;
            case 'platinum':
                newPlan = 'Platinum';
                break;
            default:
                newPlan = 'Silver';
        }
        changeUserPlan(nextPlan(user?.plan));
        fireConfetti();
        showAlert(
            <div className='flex items-flex-end gap-2 ' ><PartyPopper className={getPlanColor(newPlan)} /> Upgrade realizado com sucesso!  </div>,
            <div>Sua conta foi atualizada para o plano <strong className={getPlanColor(newPlan)}>{newPlan}</strong>! Aproveite os novos recursos e benefícios.</div>,

        )

    };
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
                    <div className="flex items-center  hover:bg-gray-700 hover:cursor-pointer p-4 rounded-md h-full hover:text-white"
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
                    <div className="flex flex-col font-lato" >
                        <span className="font-bold text-lg">Mr(s). {user?.name}</span>
                        <span className="font-inter font-[300] text-sm text-muted-foreground">{user?.email}</span>
                        <hr className="my-2" />
                        <span className=" text-gray-500 dark:text-gray-400 mb-1">Plano: <span className={getPlanColor(user?.plan)}>{user?.plan}</span></span>
                        {
                            user?.plan.toLowerCase() !== 'platinum' ? (
                                <Button className='hover:cursor-pointer bg-[var(--color-accent-trackfy)] hover:bg-[var(--color-accent-trackfy-hover)]' onClick={() => setShowUpgradeAlert(true)}>Upgrade</Button>

                            ) : <Button disabled className='cursor-not-allowed bg-gray-400 dark:bg-gray-600 text-white'>Plano Máximo</Button>
                        }
                        <hr className="my-2" />
                        <Button className='bg-[#8d0000] hover:cursor-pointer hover:bg-[#b30000] text-white'
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
            <AlertDialog open={showUpgradeAlert} onOpenChange={setShowUpgradeAlert} >
                <AlertDialogContent >
                    <AlertDialogHeader>
                        <AlertDialogTitle> Upgrade de Plano</AlertDialogTitle>
                        <AlertDialogDescription >
                            Desejar fazer o upgrade da sua conta para o plano <strong className={getPlanColor(nextPlan(user?.plan))}>{nextPlan(user?.plan)}</strong>? você terá acesso a mais funcionalidades e limites maiores de uso.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className={'bg-red-500 dark:bg-[#8D0000] text-white'} onClick={() => {

                        }}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                            upgradeAccount();
                        }} className='bg-[var(--color-accent-trackfy)] hover:bg-[var(--color-accent-trackfy-hover)]'>Confirmar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default Header;