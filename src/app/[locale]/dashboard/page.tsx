'use client'
import AreaChartExample from '@/components/charts/AreaChartExample'
import BarChartExample from '@/components/charts/BarChartExample'
import RadarChartExample from '@/components/charts/RadarChartExample'
import ScreenAdapter from '@/components/ui/ScreenAdapter'

export default function DashboardPage() {
  return (
    <main className="flex h-screen w-screen flex-col overflow-hidden bg-gray-900 text-white">
      <ScreenAdapter />
      <section className="grid flex-1 grid-cols-12 gap-4 p-4">
        {/* Left Column (3 charts) */}
        <div className="col-span-12 flex h-full flex-col gap-4 lg:col-span-3">
          <div className="min-h-0 flex-1 rounded-lg border border-gray-700 bg-gray-800/50 p-2">
            <AreaChartExample />
          </div>
          <div className="min-h-0 flex-1 rounded-lg border border-gray-700 bg-gray-800/50 p-2">
            <BarChartExample />
          </div>
          <div className="min-h-0 flex-1 rounded-lg border border-gray-700 bg-gray-800/50 p-2">
            <RadarChartExample />
          </div>
        </div>

        {/* Middle Column (1 top, 2 bottom) */}
        <div className="col-span-12 flex h-full flex-col gap-4 lg:col-span-6">
          {/* Top: Main Chart */}
          <div className="min-h-0 flex-1 rounded-lg border border-gray-700 bg-gray-800/50 p-2">
            <AreaChartExample />
          </div>
          {/* Bottom: 2 Charts */}
          <div className="grid min-h-0 flex-1 grid-cols-2 gap-4">
            <div className="h-full min-h-0 rounded-lg border border-gray-700 bg-gray-800/50 p-2">
              <BarChartExample />
            </div>
            <div className="h-full min-h-0 rounded-lg border border-gray-700 bg-gray-800/50 p-2">
              <RadarChartExample />
            </div>
          </div>
        </div>

        {/* Right Column (3 charts) */}
        <div className="col-span-12 flex h-full flex-col gap-4 lg:col-span-3">
          <div className="min-h-0 flex-1 rounded-lg border border-gray-700 bg-gray-800/50 p-2">
            <RadarChartExample />
          </div>
          <div className="min-h-0 flex-1 rounded-lg border border-gray-700 bg-gray-800/50 p-2">
            <BarChartExample />
          </div>
          <div className="min-h-0 flex-1 rounded-lg border border-gray-700 bg-gray-800/50 p-2">
            <AreaChartExample />
          </div>
        </div>
      </section>
    </main>
  )
}
