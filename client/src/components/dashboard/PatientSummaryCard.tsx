import { Link } from "wouter";
import { cn } from "@/lib/utils";

interface PatientSummaryCardProps {
  title: string;
  subtitle: string;
  value: number | string;
  unit?: string;
  target?: number;
  percentage?: number;
  badgeText?: string;
  badgeColor?: "green" | "blue" | "red" | "yellow";
  linkText?: string;
  linkHref?: string;
  items?: Array<{
    color: string;
    text: string;
  }>;
}

const PatientSummaryCard: React.FC<PatientSummaryCardProps> = ({
  title,
  subtitle,
  value,
  unit,
  target,
  percentage,
  badgeText,
  badgeColor = "green",
  linkText,
  linkHref = "#",
  items,
}) => {
  const badgeClasses = {
    green: "bg-green-100 text-green-800",
    blue: "bg-blue-100 text-blue-800",
    red: "bg-red-100 text-red-800",
    yellow: "bg-yellow-100 text-yellow-800",
  };

  return (
    <div className="bg-white rounded-lg shadow border border-neutral-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-medium text-neutral-900">{title}</h3>
            <p className="text-sm text-neutral-500">{subtitle}</p>
          </div>
          {badgeText && (
            <span className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
              badgeClasses[badgeColor]
            )}>
              {badgeText}
            </span>
          )}
        </div>
        <div className="mt-4 flex items-center">
          <div className="text-3xl font-bold text-neutral-900">{value}</div>
          {unit && <div className="ml-2 text-sm text-neutral-500">{unit}</div>}
          {target && (
            <div className="ml-2 text-sm text-neutral-500">of {target} target</div>
          )}
        </div>
        {percentage !== undefined && (
          <div className="mt-4 w-full bg-neutral-100 rounded-full h-2.5">
            <div 
              className={cn(
                "h-2.5 rounded-full",
                badgeColor === "blue" ? "bg-secondary" : "bg-primary"
              )} 
              style={{ width: `${percentage}%` }}
            />
          </div>
        )}
        {items && (
          <div className="mt-4 space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex items-center text-sm">
                <span 
                  className={`h-2.5 w-2.5 rounded-full mr-2 ${item.color}`}
                />
                <span className="text-neutral-700">{item.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {linkText && (
        <div className="bg-neutral-50 px-6 py-3">
          <Link href={linkHref}>
            <a className="text-sm font-medium text-primary hover:text-primary-dark">
              {linkText} →
            </a>
          </Link>
        </div>
      )}
    </div>
  );
};

export default PatientSummaryCard;
