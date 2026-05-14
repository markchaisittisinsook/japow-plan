import React from "react";
import { motion } from "motion/react";
import { TravelDay, WeatherInfo, OutfitSuggestion } from "../types";
import { Sun, Cloud, CloudRain, ShieldCheck, Shirt, Wind, Terminal, MapPin, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Box, Grid, Stack, Group, Text, Title, Badge, Paper, Skeleton } from "@mantine/core";

interface DayDetailsProps {
  day: TravelDay;
  weather: WeatherInfo | null;
  outfit: OutfitSuggestion | null;
  loading: boolean;
  planMarkdown: string;
}

const WeatherIconMap: Record<string, any> = {
  Sun,
  Cloud,
  CloudRain,
  Rain: CloudRain,
  Sunny: Sun,
  Cloudy: Cloud,
};

import { useMediaQuery } from "@mantine/hooks";

export default function DayDetails({ day, weather, outfit, loading, planMarkdown }: DayDetailsProps) {
  const isLarge = useMediaQuery("(min-width: 1024px)");

  return (
    <Box
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: 'var(--mantine-spacing-xl)',
      }}
    >
      {/* Weather Widget */}
      <Box style={{ gridColumn: isLarge ? 'span 4' : 'span 12' }}>
        <Box
          component={motion.div}
          key={`weather-${day.date}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(135deg, var(--mantine-color-blue-5) 0%, var(--mantine-color-indigo-6) 100%)',
            borderRadius: '24px',
            padding: '24px',
            color: 'white',
            minHeight: '220px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Group justify="space-between" align="start">
            <Stack gap={0}>
              <Text size="xs" fw={700} c="blue.1" style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>{day.date}</Text>
              <Title order={3} fw={700}>Weather</Title>
            </Stack>
            <Box bg="white/20" p={8} style={{ borderRadius: '12px' }}>
              {loading ? <Sparkles className="animate-pulse" /> : (()=>{
                const Icon = WeatherIconMap[weather?.icon || "Sun"] || Sun;
                return <Icon size={24} />;
              })()}
            </Box>
          </Group>
          
          {loading ? (
            <Stack gap="xs">
              <Skeleton height={40} radius="md" bg="white/10" />
              <Skeleton height={16} radius="md" bg="white/10" />
            </Stack>
          ) : (
            <Stack gap="md">
               <Group align="baseline" gap="xs">
                  <Text size="60px" fw={900} style={{ letterSpacing: '-0.04em', lineHeight: 1 }}>{weather?.temp || 0}°</Text>
                  <Text fw={500} size="xl" c="blue.1">{weather?.condition || "Unknown"}</Text>
               </Group>
               <Box
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 'var(--mantine-spacing-md)',
                  }}
               >
                  <Box bg="white/10" p="xs" style={{ borderRadius: '12px', textAlign: 'center' }}>
                    <Text size="10px" fw={900} c="blue.1" style={{ textTransform: 'uppercase' }}>Morning</Text>
                    <Text size="sm" fw={700}>14°</Text>
                  </Box>
                  <Box bg="white/20" p="xs" style={{ borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3)' }}>
                    <Text size="10px" fw={900} c="blue.1" style={{ textTransform: 'uppercase' }}>Peak</Text>
                    <Text size="sm" fw={700}>{weather?.temp}°</Text>
                  </Box>
                  <Box bg="white/10" p="xs" style={{ borderRadius: '12px', textAlign: 'center' }}>
                    <Text size="10px" fw={900} c="blue.1" style={{ textTransform: 'uppercase' }}>Night</Text>
                    <Text size="sm" fw={700}>12°</Text>
                  </Box>
               </Box>
            </Stack>
          )}
        </Box>
      </Box>

      {/* Outfit Suggestion */}
      <Box style={{ gridColumn: isLarge ? 'span 4' : 'span 12' }}>
        <Box
          component={motion.div}
          key={`outfit-${day.date}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bento-card"
          style={{ minHeight: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <Stack gap="xs">
            <Group gap="xs">
              <Shirt size={14} color="var(--mantine-color-blue-6)" />
              <Text size="10px" fw={900} style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }} c="dimmed">Outfit</Text>
            </Group>
            {loading ? (
              <Stack gap="xs">
                <Skeleton height={24} radius="md" />
                <Skeleton height={40} radius="md" />
              </Stack>
            ) : (
              <Stack gap="md">
                <Text size="xl" fw={700} style={{ letterSpacing: '-0.02em' }}>{outfit?.top} & {outfit?.bottom}</Text>
                <Group gap={6}>
                  {outfit?.accessories.map((acc, idx) => (
                    <Badge key={idx} variant="filled" color="slate.1" size="xs" radius="sm" p={8} style={{ color: 'var(--mantine-color-slate-7)', fontWeight: 900 }}>
                      {acc}
                    </Badge>
                  ))}
                </Group>
              </Stack>
            )}
          </Stack>
          {!loading && (
            <Box mt="md" p="sm" bg="slate.0" style={{ borderRadius: '16px', border: '1px solid var(--mantine-color-slate-1)' }}>
              <Text size="11px" c="dimmed" style={{ fontStyle: 'italic', lineHeight: 1.4 }}>"{outfit?.reason}"</Text>
            </Box>
          )}
        </Box>
      </Box>

      {/* Markdown Source */}
      <Box style={{ gridColumn: isLarge ? 'span 4' : 'span 12' }}>
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          bg="#0D1117"
          p="xl"
          style={{ borderRadius: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid var(--mantine-color-slate-8)', minHeight: '220px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        >
          <Group justify="space-between" mb="md" style={{ flexShrink: 0 }}>
            <Group gap="xs">
              <Box w={10} h={10} bg="red.6" style={{ borderRadius: '50%', opacity: 0.8 }} />
              <Box w={10} h={10} bg="yellow.6" style={{ borderRadius: '50%', opacity: 0.8 }} />
              <Box w={10} h={10} bg="green.6" style={{ borderRadius: '50%', opacity: 0.8 }} />
              <Group gap={4} ml="xs">
                <Terminal size={12} color="var(--mantine-color-slate-5)" />
                <Text size="xs" fw={700} c="dimmed" style={{ letterSpacing: '-0.02em', textTransform: 'uppercase' }}>plan.md</Text>
              </Group>
            </Group>
          </Group>
          <Box style={{ overflowY: 'auto', flex: 1 }}>
             <Text size="xs" ff="JetBrains Mono" c="slate.4" style={{ whiteSpace: 'pre-wrap', opacity: 0.8 }}>
               {planMarkdown.split('\n').filter(l => l.trim() !== '').slice(0, 10).join('\n')}
               {"\n"}...
             </Text>
          </Box>
        </Box>
      </Box>

      {/* Activity Details */}
      <Box style={{ gridColumn: isLarge ? 'span 8' : 'span 12' }}>
        <Box
          component={motion.div}
          key={`details-${day.date}`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bento-card"
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <Stack gap="xl">
            <Stack gap="xs">
              <Group gap="xs" bg="blue.0" px="sm" py={4} style={{ borderRadius: '100px', width: 'fit-content' }}>
                <MapPin size={14} color="var(--mantine-color-blue-6)" />
                <Text size="10px" fw={900} style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }} c="blue.6">{day.date}</Text>
              </Group>
              <Title order={2} fw={900} size="42px" style={{ letterSpacing: '-0.04em' }}>{day.title}</Title>
            </Stack>

            <Box
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '40px',
              }}
            >
              <Stack gap="xl">
                <Text size="xs" fw={900} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: '0.25em', borderBottom: '1px solid var(--mantine-color-slate-1)', paddingBottom: '8px' }}>Schedule</Text>
                <Stack gap="xl">
                  {day.activities.map((activity, idx) => (
                    <Group key={idx} align="start" gap="md">
                      <Box w={4} bg="blue.6" style={{ borderRadius: '100px', height: '40px' }} />
                      <Stack gap={2}>
                        <Text size="sm" fw={700} style={{ lineHeight: 1.2 }}>{activity}</Text>
                        <Text size="10px" c="dimmed">Scheduled for this period.</Text>
                      </Stack>
                    </Group>
                  ))}
                </Stack>
              </Stack>

              <Stack gap="xl">
                <Text size="xs" fw={900} c="dimmed" style={{ textTransform: 'uppercase', letterSpacing: '0.25em', borderBottom: '1px solid var(--mantine-color-slate-1)', paddingBottom: '8px' }}>Notes</Text>
                <Paper bg="slate.0" p="xl" radius="32px" style={{ border: '1px dashed var(--mantine-color-slate-2)' }}>
                  <Box style={{ fontStyle: 'italic', color: 'var(--mantine-color-slate-6)', fontSize: '14px' }}>
                    <ReactMarkdown>{day.description}</ReactMarkdown>
                  </Box>
                </Paper>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Box>

      {/* Support Card */}
      <Box style={{ gridColumn: isLarge ? 'span 4' : 'span 12' }}>
        <Box
          component={motion.div}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bento-card"
          style={{ backgroundColor: 'var(--mantine-color-emerald-0)', borderColor: 'var(--mantine-color-emerald-1)' }}
        >
          <Group gap="md">
            <Box bg="emerald.6" p="md" style={{ borderRadius: '16px', color: 'white' }}>
              <ShieldCheck size={20} />
            </Box>
            <Stack gap={0}>
              <Text size="sm" fw={900} c="emerald.9" style={{ textTransform: 'uppercase' }}>Secure Itinerary</Text>
              <Text size="xs" c="emerald.7" style={{ opacity: 0.7 }}>Verified by Wanderlust Agent</Text>
            </Stack>
          </Group>
        </Box>
      </Box>
    </Box>
);
}

