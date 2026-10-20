import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { registerCommerceIQTheme } from './theme';

interface UseEChartsOptions {
  options: echarts.EChartsOption;
  theme?: string;
  loading?: boolean;
  onEvents?: Record<string, (params: unknown) => void>;
}

/**
 * Custom React hook for robust, leak-free Apache ECharts lifecycle management.
 * Features:
 * - Idempotent dark theme registration
 * - Automatic responsive resizing via ResizeObserver with debouncing
 * - Clean teardown via chart.dispose() on unmount
 * - Reduced motion support (disables animations when requested by OS)
 */
export function useECharts<T extends HTMLDivElement = HTMLDivElement>({
  options,
  theme = 'commerceiq-dark',
  loading = false,
  onEvents,
}: UseEChartsOptions) {
  const containerRef = useRef<T | null>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    registerCommerceIQTheme();
    const container = containerRef.current;
    if (!container) return;

    // Check for reduced motion preference
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initialize or reuse chart instance
    let chart = chartInstanceRef.current;
    if (!chart || chart.isDisposed()) {
      chart = echarts.init(container, theme, {
        renderer: 'canvas',
      });
      chartInstanceRef.current = chart;
    }

    // Attach event listeners
    if (onEvents) {
      Object.entries(onEvents).forEach(([eventName, handler]) => {
        chart?.on(eventName, handler);
      });
    }

    // Handle loading state
    if (loading) {
      chart.showLoading({
        text: 'Processing analytical records...',
        color: '#8B5CF6',
        textColor: '#94A3B8',
        maskColor: 'rgba(7, 10, 19, 0.7)',
      });
    } else {
      chart.hideLoading();
    }

    // Apply reduced motion if preferred
    const finalOptions: echarts.EChartsOption = prefersReducedMotion
      ? { ...options, animation: false, animationDuration: 0 }
      : options;

    chart.setOption(finalOptions, { notMerge: true });

    // Set up debounced ResizeObserver
    let resizeTimer: number | null = null;
    const resizeObserver = new ResizeObserver(() => {
      if (resizeTimer !== null) {
        window.clearTimeout(resizeTimer);
      }
      resizeTimer = window.setTimeout(() => {
        if (chartInstanceRef.current && !chartInstanceRef.current.isDisposed()) {
          chartInstanceRef.current.resize({
            animation: {
              duration: prefersReducedMotion ? 0 : 250,
            },
          });
        }
      }, 100);
    });

    resizeObserver.observe(container);

    return () => {
      if (resizeTimer !== null) {
        window.clearTimeout(resizeTimer);
      }
      resizeObserver.disconnect();
      if (onEvents && chart) {
        Object.entries(onEvents).forEach(([eventName, handler]) => {
          chart.off(eventName, handler);
        });
      }
      if (chart && !chart.isDisposed()) {
        chart.dispose();
      }
      chartInstanceRef.current = null;
    };
  }, [options, theme, loading, onEvents]);

  return { containerRef, chartInstance: chartInstanceRef };
}
