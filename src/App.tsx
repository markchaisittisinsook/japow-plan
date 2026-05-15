import { useState, useEffect } from "react";
import { TravelPlan, TravelDay, WeatherInfo, OutfitSuggestion } from "./types";
import { parseTravelPlan } from "./lib/parser";
import { getEnrichedDayData } from "./services/geminiService";
import { planMarkdown } from "./data/mockPlan";
import CalendarItem from "./components/CalendarItem";
import DayDetails from "./components/DayDetails";
import HomeView from "./components/HomeView";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Globe2, Menu, X, Home } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Container, Grid, Group, Stack, Text, Title, Badge, Box, AppShell, Burger, ScrollArea, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export default function App() {
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [activeDayIdx, setActiveDayIdx] = useState(-1);
  const [enrichedData, setEnrichedData] = useState<Record<string, { weather: WeatherInfo; outfit: OutfitSuggestion }>>({});
  const [loading, setLoading] = useState(false);
  const [opened, { toggle, close }] = useDisclosure();

  useEffect(() => {
    const parsed = parseTravelPlan(planMarkdown);
    setPlan(parsed);
  }, []);

  const activeDay = activeDayIdx >= 0 ? plan?.days[activeDayIdx] : null;

  useEffect(() => {
    if (activeDay && !enrichedData[activeDay.date]) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const data = await getEnrichedDayData(activeDay);
          setEnrichedData(prev => ({ ...prev, [activeDay.date]: data }));
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [activeDay, enrichedData]);

  if (!plan) return (
    <Box h="100vh" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Text size="xl" fw={900} c="dimmed" style={{ letterSpacing: '0.2em' }}>กำลังโหลด...</Text>
    </Box>
  );

  return (
    <AppShell
      header={{ height: { base: 60, sm: 0 }, collapsed: false }}
      navbar={{
        width: 320,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="0"
      bg="white"
    >
      <AppShell.Header p="md" hiddenFrom="sm" style={{ borderBottom: '1px solid var(--mantine-color-slate-2)' }}>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="sm">
             <Globe2 size={20} color="var(--mantine-color-blue-6)" />
             <Text fw={900} size="sm">การเดินทาง</Text>
          </Group>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md" bg="white" style={{ borderRight: '1px solid var(--mantine-color-slate-2)' }}>
        <Stack h="100%">
          <Group gap="md" mb="xl" visibleFrom="sm">
            <Box bg="blue.6" p="sm" style={{ borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.2)' }}>
              <Globe2 color="white" size={20} />
            </Box>
            <Stack gap={0}>
              <Text size="10px" fw={900} c="dimmed" style={{ letterSpacing: '0.2em' }}>บันทึก</Text>
              <Title order={4} fw={900} style={{ letterSpacing: '-0.02em' }}>แผนการเดินทาง V1</Title>
            </Stack>
          </Group>

          <ScrollArea style={{ flex: 1 }} scrollbarSize={4}>
            <Stack gap="xs">
              <Text size="xs" fw={900} c="dimmed" mb="xs" style={{ letterSpacing: '0.1em' }} ml="xs">เมนูหลัก</Text>
              
              <UnstyledButton
                onClick={() => { setActiveDayIdx(-1); close(); }}
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  backgroundColor: activeDayIdx === -1 ? 'var(--mantine-color-blue-6)' : 'transparent',
                  color: activeDayIdx === -1 ? 'white' : 'var(--mantine-color-slate-9)',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <Home size={18} opacity={activeDayIdx === -1 ? 0.8 : 0.5} />
                <Text size="sm" fw={700}>ภาพรวมแผนการเดินทาง</Text>
              </UnstyledButton>

              <Text size="xs" fw={900} c="dimmed" mt="md" mb="xs" style={{ letterSpacing: '0.1em' }} ml="xs">กำหนดการ</Text>
              {plan.days.map((day, idx) => (
                <CalendarItem
                  key={day.date}
                  day={day}
                  index={idx}
                  isActive={activeDayIdx === idx}
                  onClick={() => {
                    setActiveDayIdx(idx);
                    close();
                  }}
                />
              ))}
            </Stack>
          </ScrollArea>

          <Box pt="md" style={{ borderTop: '1px solid var(--mantine-color-slate-1)' }}>
             <Group justify="space-between">
               <Group gap="xs" opacity={0.5}>
                  <Box w={24} h={24} style={{ border: '2px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '10px' }}>W</Box>
                  <Text size="10px" fw={900} style={{ letterSpacing: '0.2em' }}>ผู้ที่รักการเดินทาง</Text>
               </Group>
               <Badge variant="dot" color="blue" size="xs">V1.1.0</Badge>
             </Group>
          </Box>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main h="100vh" style={{ display: 'flex', flexDirection: 'column' }}>
        <ScrollArea style={{ flex: 1 }} p={0} scrollbarSize={8}>
          <Box p={{ base: '20px', sm: '40px' }}>
            <Container size="xl" p={0}>
              {/* Header Section in Main */}
              <Group justify="space-between" align="flex-end" mb={40} wrap="nowrap">
                <Stack gap="xs">
                  <Group gap={4}>
                     <Text size="xs" fw={900} c="blue.6" style={{ letterSpacing: '0.1em' }}>จุดหมายปลายทางปัจจุบัน</Text>
                  </Group>
                  <Title order={1} fw={900} size="clamp(32px, 5vw, 48px)" style={{ letterSpacing: '-0.04em', lineHeight: 1.1 }}>{plan.title}</Title>
                </Stack>
                <Box style={{ flexShrink: 0 }} hiddenFrom="xs">
                   <Badge variant="white" color="slate" size="lg" radius="xl" style={{ border: '1px solid var(--mantine-color-slate-2)', fontWeight: 900 }}>
                    {plan.days.length} วัน
                   </Badge>
                </Box>
                <Group gap="xs" visibleFrom="xs">
                  <Badge variant="white" color="slate" size="lg" radius="xl" style={{ border: '1px solid var(--mantine-color-slate-2)', fontWeight: 900, letterSpacing: '0.1em' }} p="md">
                    รวมทั้งหมด {plan.days.length} วัน
                  </Badge>
                  <Badge variant="light" color="blue" size="lg" radius="xl" style={{ fontWeight: 900 }}>สาขาหลัก</Badge>
                </Group>
              </Group>

              {/* Content Area Rendering Area */}
              <AnimatePresence mode="wait">
                {activeDayIdx === -1 ? (
                  <HomeView 
                    key="home"
                    planMarkdown={planMarkdown}
                    title={plan.title}
                  />
                ) : activeDay ? (
                  <DayDetails
                    key={activeDay.date}
                    day={activeDay}
                    weather={enrichedData[activeDay.date]?.weather || null}
                    outfit={enrichedData[activeDay.date]?.outfit || null}
                    loading={loading}
                    planMarkdown={planMarkdown}
                  />
                ) : null}
              </AnimatePresence>
            </Container>
          </Box>
        </ScrollArea>
      </AppShell.Main>
    </AppShell>
  );
}

