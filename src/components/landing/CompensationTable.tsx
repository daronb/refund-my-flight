import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const tiers = [
  { distance: "Up to 1,500 km", gross: "R5,000", zarNet: "~R5,000", example: "Intra-EU short haul" },
  { distance: "1,500–3,500 km", gross: "R8,000", zarNet: "~R8,000", example: "Intra-EU long haul" },
  { distance: "Over 3,500 km", gross: "R11,000", zarNet: "~R11,000", example: "SA ↔ Europe flights" },
];

export default function CompensationTable() {
  return (
    <section className="bg-background py-16 md:py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-4 text-center text-3xl font-bold text-foreground md:text-4xl">
          How Much Could You Get?
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-center text-muted-foreground">
          Airlines pay up to R11,000 per passenger. After our 25%&nbsp;+&nbsp;VAT success fee, you receive up to <strong className="text-foreground">~R11,000</strong>. All SA–Europe flights qualify for the maximum tier.
        </p>
        <Card className="mx-auto max-w-3xl border-0 shadow-md overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary hover:bg-primary">
                  <TableHead className="text-primary-foreground font-semibold">Flight Distance</TableHead>
                  <TableHead className="text-primary-foreground font-semibold">Airline Pays</TableHead>
                  <TableHead className="text-primary-foreground font-semibold">You Receive</TableHead>
                  <TableHead className="text-primary-foreground font-semibold hidden md:table-cell">Example</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tiers.map((tier, i) => (
                  <TableRow key={tier.distance} className={i === 2 ? "bg-accent/10 font-semibold" : ""}>
                    <TableCell>{tier.distance}</TableCell>
                    <TableCell className="text-muted-foreground">{tier.gross}</TableCell>
                    <TableCell className="font-bold text-foreground">{tier.zarNet}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{tier.example}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
