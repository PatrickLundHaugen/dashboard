import { Card, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import GoalsSection from "@/components/overviewSection/goalsSection.tsx";
import Timer from "@/components/overviewSection/timer.tsx";

function Overview() {
  return (
    <>
      <section className="flex flex-col md:flex-row *:md:flex-1 gap-4 px-4">
        <GoalsSection />
        <Card>
          <CardHeader>
            <CardTitle>To be determined</CardTitle>
          </CardHeader>
        </Card>
        <Timer />
      </section>
    </>
  );
}

export default Overview;
