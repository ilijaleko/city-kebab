import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-orange-600">City Kebab</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            Test Button
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
