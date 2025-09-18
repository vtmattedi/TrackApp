import React from 'react';
import Chart, { type ChartData } from '../chart';
import { Card, CardHeader } from '@/components/ui/card';
import { useGlobals } from '@/Providers/globals';
import { getDataPerDate, chartConfigPerDate, chartConfigPerArea } from '@/assets/util/AttachedData';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Calendar1, X, Squircle, ListFilter, Check, TrendingUp, CircleSlash2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChartPieDonutText } from '@/components/pieChart';
import InfoCard from '@/components/infoCard';
type FilterType = {
    area: string[];
    function: string[];
    days: number; // -1 for all days, 7 for last 7 days from the most recent date in the data
}


const availableFunctions = [...Object.keys(chartConfigPerDate)];
const availableAreas = [...Object.entries(chartConfigPerArea).map(([_, value]) => value.label)];

const Home: React.FC = () => {
    const { onMobile } = useGlobals();
    const baseData = getDataPerDate();
    // Get the most recent date from the data
    const maxDate = new Date(Math.max(...baseData.map(o => new Date(o.date).getTime())));
    const [filters, setFilters] = React.useState<FilterType>({
        area: availableAreas,
        function: availableFunctions,
        days: 30,
    });

    const getFilteredData: () => ChartData[] = () => {
        const baseData = getDataPerDate();
        const data = baseData.map(item => {
            if (filters.days > -1 && new Date(item.date) < new Date(maxDate.getTime() - (filters.days * 24 * 60 * 60 * 1000))) {
                return null;
            }
            const newData: any = {
                data: new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' }),
            };
            filters.function.forEach(func => {
                let newValue = 0;
                const key = func.toLowerCase();
                for (const value of item.values) {
                    if (value.hasOwnProperty(key)) {
                        if (filters.area.includes(value[key].area)) {
                            newValue += value[key].value;
                        }
                    }
                }
                newData[key] = newValue;
            });
            return newData;
        });
        return data.filter(item => item !== null);
    }
    const filterChartConfig = (config: typeof chartConfigPerDate | typeof chartConfigPerArea, filter: string[]) => {
        return Object.fromEntries(
            Object.entries(config).filter(([key, _]) => filter.includes(key))
        );
    }

    const getFilteredAvg = (): number => {
        const filteredData = getFilteredData();
        if (filteredData.length === 0) return 0;

        return Math.round(filteredData.reduce((acc, item) => {
            let total = 0;
            Object.entries(item).forEach(([_, value]) => {
                //sum all values that are numbers i.e. filtred data keys skipping DATE
                if (value && typeof value === 'number') {
                    total += value;
                }
            });
            console.log(item, total, acc);
            return acc + total;
        }, 0) / filteredData.length)
    }

    const getFilteredMax = (): { value: number, date: string } => {
        const filteredData = getFilteredData();
        const res = { value: 0, date: '' };
        filteredData.forEach(item => {
            let total = 0;
            Object.entries(item).forEach(([_, value]) => {
                //sum all values that are numbers i.e. filtred data keys skipping DATE
                if (value && typeof value === 'number') {
                    total += value;
                }
            });
            if (total > res.value) {
                res.value = total;
                res.date = item.data;
            }
        });
        return res;
    }

    return (
        <>
            <div className=' top-[64px] left-0 w-[100vw] h-32 flex flex-row h-[48px] bg-gray-300 dark:bg-[#111111] shadow-md justify-between items-center px-4 border-b border-gray-200 dark:border-gray-700'
                style={{
                    position: 'sticky',
                    zIndex: 999,

                }}

            >

                <div className="gap-4 flex  items-center">
                    {
                        !onMobile ? <h1 className='text-2xl font-[400] font-lato: ml-4'>Filtrar Dados</h1> : null
                    }
                    <Popover >
                        <PopoverTrigger asChild>
                            <div className="flex items-center ">
                                <Button variant="outline">
                                    <ListFilter className="mr-2" />
                                    Filtrar Funções {
                                        filters.function.length !== availableFunctions.length && <>({filters.function.length})</>
                                    }
                                </Button>
                                {
                                    filters.function.length !== availableFunctions.length ? (
                                        <div>
                                            <X onClick={() => setFilters(prev => ({ ...prev, function: availableFunctions }))} color="red" className="text-red-500 hover:text-red-300 hover:cursor-pointer" />
                                        </div>
                                    ) : null

                                }
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="">
                            {
                                Object.entries(chartConfigPerDate).map(([key, config]) => (
                                    <div key={key} className="flex items-center space-x-2 gap-2 hover:cursor-pointer"
                                        onClick={() => setFilters(prev => {
                                            if (prev.function.includes(key)) {
                                                return { ...prev, function: prev.function.filter(f => f !== key) }
                                            }
                                            return { ...prev, function: [...prev.function, key] }
                                        })}
                                    >
                                        {
                                            filters.function.includes(key) ? <Squircle fill={config.color} /> : <Squircle fill="gray" />
                                        }
                                        {config.label}
                                    </div>
                                ))
                            }
                        </PopoverContent>
                    </Popover>
                    <Popover  >
                        <PopoverTrigger asChild>
                            <div className="flex items-center ">
                                <Button variant="outline">
                                    <ListFilter className="mr-2" />
                                    Filtrar Áreas {
                                        filters.area.length !== availableAreas.length && <>({filters.area.length})</>
                                    }
                                </Button>
                                {
                                    filters.area.length !== availableAreas.length ? (
                                        <div>
                                            <X onClick={() => setFilters(prev => ({ ...prev, area: availableAreas }))} className="text-red-500 hover:text-red-300 hover:cursor-pointer" />
                                        </div>
                                    ) : null

                                }
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="">
                            {
                                Object.entries(chartConfigPerArea).map(([key, config]) => (
                                    <div key={key} className="flex items-center space-x-2 gap-2 hover:cursor-pointer"
                                        onClick={() => setFilters(prev => {
                                            if (prev.area.includes(config.label)) {
                                                return { ...prev, area: prev.area.filter(f => f !== config.label) }
                                            }
                                            return { ...prev, area: [...prev.area, config.label] }
                                        })}
                                    >
                                        {filters.area.includes(config.label) ? <Check color={"green"} /> : <X color="gray" />}
                                        {config.label}
                                    </div>
                                ))
                            }
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="flex gap-4 justify-between">
                    <ToggleGroup type="single" value={"" + filters.days} className=" border " aria-label="Theme Toggle"
                        onValueChange={(value) => {
                            if (value) setFilters((prev) => ({ ...prev, days: parseInt(value) }))
                        }}>
                        <ToggleGroupItem value={"1"} className='hover:cursor-pointer'
                        >24H</ToggleGroupItem>
                        <ToggleGroupItem value={"7"} className='hover:cursor-pointer'
                        >Sem</ToggleGroupItem>
                        <ToggleGroupItem value={"30"} className='hover:cursor-pointer'
                        ><Calendar1 /></ToggleGroupItem>

                    </ToggleGroup>
                </div>
            </div>
            <div className='w-[100vw] h-[calc(100vh-64px-48px)] flex justify-center items-flex-start p-4'
                style={{
                    flexDirection: onMobile ? 'column' : 'row',
                    justifyContent: onMobile ? 'flex-start' : 'center',
                    overflowY: 'auto',
                }}
            >
                <div className='min-w-[400px] size-full'
                    style={{
                        minHeight: onMobile ? '485px' : '500px',
                    }}>
                    <Card>
                        <CardHeader className='font-lato'>
                            <div className='flex flex-col p-0'>
                                <div className='font-lato text-sm'>Quantidade de funcionarios por dia</div>
                                <div className='text-sm font-lato font-[300]'>
                                    Análise {filters.days === -1 ? 'de todos os dias' : 'dos últimos ' + filters.days + ' dias'} para {filters.function.length} funções em {filters.area.length} áreas.
                                </div>
                            </div>
                        </CardHeader>
                        <Chart data={getFilteredData()} chartConfig={filterChartConfig(chartConfigPerDate, filters.function)} />
                    </Card>
                </div>
                <div className='flex gap-2 flex-col ml-2 w-full'>
                    <div className='flex flex-row gap-2 '>
                        <InfoCard
                            cardTitle={<><CircleSlash2 /> Média</>}
                            number={getFilteredAvg()}
                            unit="de funcionários por dia"
                            description={filters.days === -1 ? 'Todos os dias' : 'Nos últimos ' + filters.days + ' dias'}
                        />
                        <InfoCard
                            cardTitle={<><TrendingUp /> Pico</>}
                            number={getFilteredMax().value}
                            unit="de funcionários por dia"
                            description={filters.days === -1 ? 'Todos os dias' : 'Nos últimos ' + filters.days + ' dias'}

                        />

                    </div >
                    <Card className='p-4'>
                        <ChartPieDonutText></ChartPieDonutText>
                    </Card>
                </div>

                {/* <Card className='p-4'>
                    <h1 className='text-2xl font-bold'>Welcome to the Tracking Application</h1>
                    <p className='mt-2'>Use the navigation to explore the app.</p>
                </Card>
                <Card className='p-4'>
                    <h1 className='text-2xl font-bold'>Welcome to the Tracking Application</h1>
                    <p className='mt-2'>Use the navigation to explore the app.</p>
                </Card>
                <Card className='p-4'>
                    <h1 className='text-2xl font-bold'>Welcome to the Tracking Application</h1>
                    <p className='mt-2'>Use the navigation to explore the app.</p>
                </Card>
                <Card className='p-4'>
                    <h1 className='text-2xl font-bold'>Welcome to the Tracking Application</h1>
                    <p className='mt-2'>Use the navigation to explore the app.</p>
                </Card> */}

            </div >

        </>
    );
};

export default Home;