import React from "react";
import { motion } from "motion/react";
import { Terminal, FileText, Info, Globe2, Sparkles } from "lucide-react";
import { Box, Stack, Group, Text, Title, Paper, ScrollArea, Badge } from "@mantine/core";

interface HomeViewProps {
  planMarkdown: string;
  title: string;
}

export default function HomeView({ planMarkdown, title }: HomeViewProps) {
  return (
    <Stack gap="xl">
      <Box 
        component={motion.div}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: 'linear-gradient(135deg, var(--mantine-color-blue-5) 0%, var(--mantine-color-indigo-6) 100%)',
          borderRadius: '32px',
          padding: '48px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box style={{ position: 'absolute', top: '-10%', right: '-10%', opacity: 0.1 }}>
            <Globe2 size={400} />
        </Box>

        <Stack gap="xs" style={{ position: 'relative', zIndex: 1 }}>
           <Group gap="xs">
              <Sparkles size={16} />
              <Text fw={900} size="xs" style={{ letterSpacing: '0.2em', textTransform: 'uppercase' }}>ภาพรวมการเดินทาง</Text>
           </Group>
           <Title order={1} size="64px" fw={900} style={{ letterSpacing: '-0.04em', lineHeight: 1 }}>
             {title}
           </Title>
           <Text size="lg" opacity={0.8} maw={600} mt="md">
             ยินดีต้อนรับสู่แผนการเดินทางที่คุณสร้างขึ้น เราได้รวบรวมกำหนดการเดินทางพร้อมการวิเคราะห์สภาพอากาศแบบเรียลไทม์ คำแนะนำการแต่งกาย และข้อมูลการเดินทางที่จำเป็นไว้ให้คุณแล้ว
           </Text>
        </Stack>
      </Box>

      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: 'var(--mantine-spacing-xl)',
        }}
      >
        <Box style={{ gridColumn: 'span 12' }}>
           <Box 
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            bg="slate.0"
            p="xl"
            style={{ 
              borderRadius: '32px', 
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)', 
              border: '1px solid var(--mantine-color-slate-3)',
              overflow: 'hidden'
            }}
          >
            <Group justify="space-between" mb="xl">
              <Group gap="xs">
                <Box w={12} h={12} bg="red.5" style={{ borderRadius: '50%' }} />
                <Box w={12} h={12} bg="yellow.5" style={{ borderRadius: '50%' }} />
                <Box w={12} h={12} bg="green.5" style={{ borderRadius: '50%' }} />
                <Group gap={8} ml="sm">
                  <Terminal size={14} color="var(--mantine-color-slate-5)" />
                  <Text size="xs" fw={900} c="slate.6" style={{ letterSpacing: '0.1em' }}>ซอร์สโค้ด PLAN.MD</Text>
                </Group>
              </Group>
              <Badge variant="outline" color="slate.5" radius="xs" size="xs">อ่านอย่างเดียว</Badge>
            </Group>
            
            <ScrollArea h={400} offsetScrollbars>
               <Text size="sm" ff="JetBrains Mono" c="slate.8" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                 {planMarkdown}
               </Text>
            </ScrollArea>
           </Box>
        </Box>

        <Box style={{ gridColumn: 'span 12' }}>
          <Group gap="xl" grow>
             <Paper 
                component={motion.div}
                whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)' }}
                p="xl" 
                radius="24px" 
                style={{ border: '1px solid var(--mantine-color-slate-7)', transition: 'all 0.3s ease' }}
              >
                <Group gap="md">
                   <Box bg="blue.0" p="sm" style={{ borderRadius: '12px' }}>
                      <Info size={20} color="var(--mantine-color-blue-6)" />
                   </Box>
                   <Stack gap={0}>
                      <Text fw={900} size="sm">การวิเคราะห์อัจฉริยะ</Text>
                      <Text size="xs" c="dimmed">เปิดใช้งานการเพิ่มข้อมูลด้วย AI แล้ว</Text>
                   </Stack>
                </Group>
             </Paper>
             <Paper 
                component={motion.div}
                whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)' }}
                p="xl" 
                radius="24px" 
                style={{ border: '1px solid var(--mantine-color-slate-7)', transition: 'all 0.3s ease' }}
              >
                <Group gap="md">
                   <Box bg="indigo.0" p="sm" style={{ borderRadius: '12px' }}>
                      <FileText size={20} color="var(--mantine-color-indigo-6)" />
                   </Box>
                   <Stack gap={0}>
                      <Text fw={900} size="sm">รูปแบบ Markdown</Text>
                      <Text size="xs" c="dimmed">โครงสร้างเวอร์ชัน 1.1.0</Text>
                   </Stack>
                </Group>
             </Paper>
          </Group>
        </Box>
      </Box>
    </Stack>
  );
}
