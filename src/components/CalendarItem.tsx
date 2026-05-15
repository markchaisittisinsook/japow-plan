import { motion } from "motion/react";
import { format, parseISO } from "date-fns";
import { th } from "date-fns/locale";
import { TravelDay } from "../types";
import { UnstyledButton, Text, Box, Group, Stack } from "@mantine/core";

interface CalendarItemProps {
  day: TravelDay;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

export default function CalendarItem({ day, index, isActive, onClick }: CalendarItemProps) {
  const date = parseISO(day.date);
  const dayNum = format(date, "dd");
  const weekday = format(date, "EEE", { locale: th });
  const month = format(date, "MMM", { locale: th });

  return (
    <UnstyledButton
      component={motion.button}
      onClick={onClick}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        width: '100%',
        padding: '16px',
        borderRadius: '16px',
        border: '1px solid',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        backgroundColor: isActive ? 'var(--mantine-color-blue-6)' : 'transparent',
        borderColor: isActive ? 'var(--mantine-color-blue-6)' : 'transparent',
        color: isActive ? 'var(--mantine-color-white)' : 'var(--mantine-color-slate-9)',
        boxShadow: isActive ? '0 10px 15px -3px rgba(37, 99, 235, 0.2)' : 'none',
        textAlign: 'left',
      }}
    >
      <Group wrap="nowrap" gap="md">
        <Stack gap={0} align="center" style={{ minWidth: '40px' }}>
          <Text size="10px" fw={900} style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }} opacity={isActive ? 0.8 : 0.5}>
            {weekday}
          </Text>
          <Text size="20px" fw={900} style={{ letterSpacing: '-0.02em', lineHeight: 1 }}>
            {dayNum}
          </Text>
          <Text size="10px" fw={900} style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }} opacity={isActive ? 0.8 : 0.5}>
            {month}
          </Text>
        </Stack>

        <Box style={{ flex: 1, overflow: 'hidden' }}>
          <Text size="xs" fw={900} style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }} opacity={isActive ? 0.8 : 0.5} mb={2}>
            วันที่ {index + 1}
          </Text>
          <Text size="sm" fw={700} style={{ lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {day.title}
          </Text>
        </Box>
      </Group>
      
      {isActive && (
        <Box
          component={motion.div}
          layoutId="active-indicator"
          style={{
            position: 'absolute',
            left: '0',
            top: '25%',
            bottom: '25%',
            width: '4px',
            backgroundColor: 'white',
            borderRadius: '0 4px 4px 0',
          }}
        />
      )}
    </UnstyledButton>
  );
}
