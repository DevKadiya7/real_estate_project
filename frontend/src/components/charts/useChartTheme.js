import { useTheme } from '../../context/ThemeContext'
import { CHART_CHROME } from '../../constants/chartPalette'

/** Shared Recharts styling (grid/axis colors, tick style) sourced from the
 * validated dataviz chrome tokens — kept in one place so every chart reads
 * identically in light/dark. */
export function useChartTheme() {
  const { isDark } = useTheme()
  const chrome = isDark ? CHART_CHROME.dark : CHART_CHROME.light

  return {
    chrome,
    gridProps: { stroke: chrome.gridline, strokeDasharray: '3 3' },
    axisProps: { stroke: chrome.baseline, tick: { fill: chrome.secondaryInk, fontSize: 12 } },
  }
}
