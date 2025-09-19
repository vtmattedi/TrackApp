import React from 'react';
import { Card } from './ui/card';
import { chartConfigPerArea, chartConfigPerDate, getDataPerDate } from '@/assets/util/AttachedData';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import { LabelList, PieChart, Pie } from 'recharts';
import { type FilterType } from '@/components/filters';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useGlobals } from '@/Providers/globals';
interface PieCardProps extends React.ComponentProps<"div"> {
    filters: FilterType;
}

const PieCard: React.FC<PieCardProps> = ({ filters, ...props }) => {
    const baseData = getDataPerDate();
    const filterClassProps = { ...props };
    delete filterClassProps.className; // Remove className to avoid passing it twice
    const [numAreas, setNumAreas] = React.useState<number>(filters.area.length);
    const [selectedArea, setSelectedArea] = React.useState<string>("all");
    const [selectedDate, setSelectedDate] = React.useState<number>(0);
    const [dateOptions, setDateOptions] = React.useState<string[]>([]); // Options for date selection
    const { onMobile } = useGlobals();
    // Component re-renders when filters change so we can use simple functions to get filtered data

    const getFilteredData: () => any[] = () => {
        // If no areas selected, return empty data
        if (numAreas === 0) return [];
        // If one area selected, return data for that area
        if (numAreas === 1 || selectedArea !== "all") {
            const _area = numAreas === 1 ? filters.area[0] : selectedArea;
            const data = baseData;
            // Final Data for the most recent date
            const newData = [] as { name: string, value: number, fill: string }[];
            let count = 0; // Helper to assign colors
            //Extract keys from the last object in data array (most recent date)
            data.forEach(item => {
                let key = item.date;
                if (filters.dataType.time === 'Daily') {
                    key = new Date(item.date).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
                }
                else if (filters.dataType.time === 'Weekly') {
                    const firstDayOfWeek = new Date(item.date);
                    firstDayOfWeek.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay());
                    const lastDayOfWeek = new Date(firstDayOfWeek);
                    lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
                    key = firstDayOfWeek.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit' }) + " - " + lastDayOfWeek.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit' });
                }
                else if (filters.dataType.time === 'Monthly') {
                    const date = new Date(item.date);
                    key = date.toLocaleString('pt-BR', { month: 'short', year: '2-digit' });
                }
                if (key !== dateOptions[selectedDate]) {
                    return;
                }
                item.values.forEach(item => {
                    if (item.area !== _area ) {
                        return;
                    }
                    const existing = newData.find(newItem => newItem.name === item.function);
                    if (existing) {
                        existing.value += item.value;
                        return;
                    }
                    else {
                        count++;
                        newData.push({
                            name: item.function,
                            value: item.value,
                            // Makes sure we get the correct color from config, maintaing consistency
                            fill: chartConfigPerDate[item.function as keyof typeof chartConfigPerDate]?.color || `var(--chart-${count})`,
                        });
                    }
                });

            });
            return newData;
        }
        // If multiple areas selected, return aggregated data per area
        else {
            const data = baseData
            const newData = [] as { name: string, value: number, fill: string }[];
            let count = 5; // Helper to assign colors
            // Starts at 5 to avoid color clash with functions
            data.forEach(item => {
                let key = item.date;
                if (filters.dataType.time === 'Daily') {
                    key = new Date(item.date).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
                }
                else if (filters.dataType.time === 'Weekly') {
                    const firstDayOfWeek = new Date(item.date);
                    firstDayOfWeek.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay());
                    const lastDayOfWeek = new Date(firstDayOfWeek);
                    lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
                    key = firstDayOfWeek.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit' }) + " - " + lastDayOfWeek.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit' });
                }
                else if (filters.dataType.time === 'Monthly') {
                    const date = new Date(item.date);
                    key = date.toLocaleString('pt-BR', { month: 'short', year: '2-digit' });
                }
                if (key !== dateOptions[selectedDate]) {
                    return;
                }
                item.values.forEach(item => {
                    if (!filters.area.includes(item.area) || !filters.function.includes(item.function)) {
                        return;
                    }
                    const existing = newData.find(newItem => newItem.name === item.area);
                    if (existing) {
                        existing.value += item.value;
                        return;
                    }
                    else {
                        count++;
                        newData.push({
                            name: item.area,
                            value: item.value,
                            fill: `var(--chart-${count})`,
                        });// For debug
                    }
                });

            });
            return newData;


        }


    }

    const getFilteredChartConfig: () => ChartConfig = () => {
        //No need to filter here since on pie chart we get the color from data directly
        //Also we are not showing legend.
        if (filters.area.length === 0) return {};
        if (filters.area.length === 1 || selectedArea !== "all") {
            return chartConfigPerDate;
        }
        else {
            return chartConfigPerArea;
        }
    }
    React.useEffect(() => {
        // Generate date options based on selected area
        let options: string[] = [];
        if (filters.dataType.time === 'Daily') {
            options = Array.from(new Set(baseData.map(d => new Date(d.date).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' }))))
        }
        else if (filters.dataType.time === 'Weekly') {
            const weekSet = new Set<string>();
            baseData.forEach(d => {
                const date = new Date(d.date);
                const firstDayOfWeek = new Date(date);
                firstDayOfWeek.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay());
                const lastDayOfWeek = new Date(firstDayOfWeek);
                lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
                const weekRange = firstDayOfWeek.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit' }) + " - " + lastDayOfWeek.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit' });
                weekSet.add(weekRange);
            });
            options = Array.from(weekSet);
        }
        else if (filters.dataType.time === 'Monthly') {
            options = Array.from(new Set(baseData.map(d => {
                const date = new Date(d.date);
                return date.toLocaleString('pt-BR', { month: 'short', year: '2-digit' });
            })));
        }
        setDateOptions(options.reverse());
        setSelectedDate(0); // Default to the most recent date
    }, [filters.dataType.time]);
    React.useEffect(() => {
        setNumAreas(filters.area.length);
        if (!filters.area.includes(selectedArea)) {
            setSelectedArea("all");
        }
    }, [filters.area]);
    React.useEffect(() => {
        numAreas === 1 && setSelectedArea(filters.area[0]);
    }, [selectedArea]);

    return (
        <Card className={props.className} {...filterClassProps}
            style={{
                width: onMobile ? '100%' : '510px',
                height: '100%',
            }}
        >
            <div className='text-center text-lg font-inter flex justify-center items-center gap-2 '>
                {
                    numAreas === 0 ? " Selecione ao menos uma área para ver a distribuição." : numAreas === 1 ? filters.area[0] : "Distribuição por Área" + (selectedArea == 'all' ? "" : ": " + selectedArea)
                }
                {numAreas > 1 &&
                    <Select
                        value={selectedArea}
                        onValueChange={setSelectedArea}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Selecione uma área" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem key={"allAreas"} value="all">Todas as Áreas</SelectItem>
                            {filters.area.map(area => (
                                <SelectItem key={area} value={area}>
                                    {area}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                }
                <Select
                    value={selectedDate.toString()}
                    onValueChange={(value) => {
                        const index = parseInt(value);
                        if (isNaN(index) || index < 0 || index >= dateOptions.length) {
                            setSelectedDate(dateOptions.length - 1);
                        }
                        else {
                            setSelectedDate(parseInt(value));
                        }
                    }}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Selecione uma data" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem key={"last"} value="-1">Última </SelectItem>
                        {dateOptions.map((dateStr, index) => (
                            <SelectItem key={dateStr} value={index.toString()}>
                                {dateStr}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div >
                <ChartContainer config={getFilteredChartConfig()}
                    className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0 w-full"

                >
                    <PieChart>
                        <ChartTooltip
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie data={getFilteredData()} dataKey="value" label={
                            ({ name, percent }) => {
                                return onMobile ? ` ${(percent * 100).toFixed(0)}%` : `${getFilteredChartConfig()[name]?.label || name}`
                            }
                        } nameKey="name">
                            <LabelList
                                dataKey="value"
                                className="fill-background font-inter font-bold"
                                stroke="2"
                                fontSize={20}
                                formatter={(percent: string) => `${percent}`}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </div>
        </Card>
    );
};

export default PieCard;