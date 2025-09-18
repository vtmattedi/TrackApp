import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ThemeSelector from "@/components/ThemeSelector";

import { ShieldOff } from "lucide-react";
import { useGlobals } from "@/Providers/globals";
import { useAlert } from "@/Providers/alerts";
const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const { showAlert } = useAlert();
    const TrackFyLogo = {
        inverted: 'https://trackfyapp.com.br/images/logo/logo-cor-2.svg',
        normal: 'https://trackfyapp.com.br/images/logo/logo-trackfy.svg'
    }
    // Fake login handler
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate an API call
        setTimeout(() => {
            setLoading(false);
            // Display error since we don't have a real backend
            showAlert(
                <div className="flex items-center"><ShieldOff className="mr-2" />Serviço Indisponível</div>,
                <div>Este serviço está temporariamente indisponível. Tente utilizar a <strong>conta de demonstração</strong> ou entre em contato com o suporte.</div>,
                () => { }
            );

        }, 1000);

    };


    useEffect(() => {
        document.title = "Login - TrackApp";

    }, []);
    const { user, onMobile } = useGlobals();
    useEffect(() => {
        if (user) {
            // If a user is already logged in, redirect to home
            window.location.href = '/';
        }
    }, [user]);
    return (
        <div className="flex min-h-screen items-center justify-center bg-blue-900 w-[100vw] dark:bg-gray-900 p-4"

            style={{
                background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/bg01.png)',
                backgroundSize: 'cover',

            }}
        >
            <div >
                <h1 className="text-2xl font-bold mb-4 text-center"> Trackfy Data </h1>
                <p>Bem-vindo ao Trackfy, sua plataforma de análise de dados de localização em tempo real.</p>
                <img src='https://trackfyapp.com.br/images/logo/logo-cor-2.svg'></img>
            </div>
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader >
                    <div className="flex justify-between items-center font-lato">
                        <CardTitle>Login </CardTitle>
                        <ThemeSelector />
                    </div>
                </CardHeader>
                <CardContent className="font-inter">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block mb-1 text-sm font-medium">
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@company.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-1 text-sm font-medium">
                                Senha
                            </label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full bg-[var(--color-accent-trackfy)] hover:bg-[var(--color-accent-trackfy-hover)]" disabled={loading}>
                            {loading ? "Entrando..." : "Entrar"}
                        </Button>
                    </form>
                    <hr className="my-6" />
                    <Button variant="outline" className="w-full">
                        Login with Google
                    </Button>
                    <Button variant="outline" className="w-full mt-4">
                        Login with GitHub
                    </Button>
                    <Button variant="outline" className="w-full mt-4"
                        onClick={() => {
                            window.location.href = '/';
                        }}
                    >
                        Usar conta demo
                    </Button>
                </CardContent>
            </Card>

        </div>
    );
};

export default Login;