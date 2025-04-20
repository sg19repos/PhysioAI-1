import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface RangeOfMotionChartProps {
  data: {
    dates: string[];
    flexion: number[];
    abduction: number[];
  };
}

export const RangeOfMotionChart: React.FC<RangeOfMotionChartProps> = ({ data }) => {
  const chartData = {
    labels: data.dates,
    datasets: [
      {
        label: 'Flexion',
        data: data.flexion,
        borderColor: 'hsl(var(--secondary))',
        backgroundColor: 'hsl(var(--secondary) / 0.5)',
        tension: 0.3,
      },
      {
        label: 'Abduction',
        data: data.abduction,
        borderColor: 'hsl(var(--accent))',
        backgroundColor: 'hsl(var(--accent) / 0.5)',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 180,
        title: {
          display: true,
          text: 'Degrees (°)',
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Range of Motion Improvement</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: '200px' }}>
          <Line data={chartData} options={options} />
        </div>
        <div className="mt-2 flex justify-center space-x-6">
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-secondary mr-2"></span>
            <span className="text-xs text-neutral-700">Flexion</span>
          </div>
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-accent mr-2"></span>
            <span className="text-xs text-neutral-700">Abduction</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface PostureQualityChartProps {
  data: {
    weeks: string[];
    scores: number[];
  };
}

export const PostureQualityChart: React.FC<PostureQualityChartProps> = ({ data }) => {
  const chartData = {
    labels: data.weeks,
    datasets: [
      {
        label: 'Posture Quality',
        data: data.scores,
        backgroundColor: [
          'hsl(var(--neutral-300))',
          'hsl(var(--neutral-400))',
          'hsl(var(--neutral-500))',
          'hsl(var(--neutral-600))',
          'hsl(var(--neutral-700))',
          'hsl(var(--neutral-800))',
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Quality Score',
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Posture Quality Score</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: '200px' }}>
          <Bar data={chartData} options={options} />
        </div>
        <div className="mt-2 text-center">
          <div className="text-sm font-medium text-neutral-600">Current Score: {data.scores[data.scores.length - 1]}/100</div>
          <div className="text-xs text-neutral-500">Showing steady improvement over time</div>
        </div>
      </CardContent>
    </Card>
  );
};

interface RecoveryTimelineProps {
  phases: Array<{
    title: string;
    date: string;
    completed: boolean;
    current: boolean;
  }>;
}

export const RecoveryTimeline: React.FC<RecoveryTimelineProps> = ({ phases }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Predicted Recovery Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative pt-4">
          {phases.map((phase, index) => (
            <div key={index} className="flex items-center mb-6">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                phase.completed ? 'bg-primary' : phase.current ? 'bg-primary-light' : 'bg-neutral-200 text-neutral-500'
              }`}>
                {phase.completed ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : phase.current ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-neutral-900">{phase.title}</h4>
                <p className="text-xs text-neutral-500">{phase.date}</p>
              </div>
            </div>
          ))}
          
          {/* Timeline line */}
          <div className="absolute left-5 top-14 bottom-14 w-0.5 bg-primary"></div>
        </div>
      </CardContent>
    </Card>
  );
};
