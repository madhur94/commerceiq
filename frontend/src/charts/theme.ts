import * as echarts from 'echarts';

/**
 * CommerceIQ Custom ECharts Dark Theme
 * Calibrated for high-contrast dark midnight-navy backgrounds (#070A13 / #111827).
 * Conforms to WCAG 2.1 AA contrast requirements and brand color tokens.
 */
export const commerceIQChartTheme = {
  backgroundColor: 'transparent',
  textStyle: {
    fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    color: '#94A3B8',
  },
  title: {
    textStyle: {
      color: '#F8FAFC',
      fontWeight: 600,
      fontSize: 14,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    },
    subtextStyle: {
      color: '#64748B',
      fontSize: 12,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    },
  },
  legend: {
    textStyle: {
      color: '#94A3B8',
      fontSize: 12,
    },
    icon: 'roundRect',
    itemWidth: 14,
    itemHeight: 8,
    itemGap: 16,
  },
  grid: {
    top: 40,
    right: 20,
    bottom: 30,
    left: 50,
    containLabel: true,
    borderColor: 'transparent',
  },
  categoryAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.1)',
      },
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: '#94A3B8',
      fontSize: 11,
      margin: 10,
    },
    splitLine: {
      show: false,
    },
  },
  valueAxis: {
    axisLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisLabel: {
      color: '#94A3B8',
      fontSize: 11,
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.05)',
        type: 'dashed',
      },
    },
  },
  tooltip: {
    backgroundColor: 'rgba(17, 24, 39, 0.94)',
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderWidth: 1,
    padding: [10, 14],
    textStyle: {
      color: '#F8FAFC',
      fontSize: 12,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    },
    extraCssText:
      'box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 0 15px 0 rgba(139, 92, 246, 0.1); backdrop-filter: blur(8px); border-radius: 8px;',
    axisPointer: {
      lineStyle: {
        color: 'rgba(139, 92, 246, 0.5)',
        type: 'dashed',
        width: 1,
      },
      crossStyle: {
        color: 'rgba(139, 92, 246, 0.5)',
      },
      shadowStyle: {
        color: 'rgba(139, 92, 246, 0.05)',
      },
    },
  },
  color: [
    '#8B5CF6', // Laser Violet (Primary revenue, PC1, Cluster 0)
    '#06B6D4', // Electric Cyan (Secondary events, purchases)
    '#6366F1', // Neon Indigo (Views, sessions)
    '#EC4899', // Radiant Magenta (Top brands, carts)
    '#10B981', // Emerald Mint (Cluster 1, growth)
    '#F59E0B', // Amber Spark (Outliers, alerts)
  ],
};

let isThemeRegistered = false;

/**
 * Register the CommerceIQ custom theme idempotently
 */
export function registerCommerceIQTheme(): void {
  if (!isThemeRegistered) {
    echarts.registerTheme('commerceiq-dark', commerceIQChartTheme);
    isThemeRegistered = true;
  }
}
