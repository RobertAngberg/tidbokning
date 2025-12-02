import { hämtaStatistik } from "@/_server/actions/statistik";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/_components/ui/Card";

export default async function DashboardPage() {
  const stats = await hämtaStatistik();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Översikt över dina bokningar och statistik</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Totalt Bokningar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalaBokningar}</div>
            <p className="text-xs text-muted-foreground mt-1">Alla bokningar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Denna Vecka</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.bokningarDennaVecka}</div>
            <p className="text-xs text-muted-foreground mt-1">Nya bokningar denna vecka</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Denna Månad</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.bokningarDennaMånad}</div>
            <p className="text-xs text-muted-foreground mt-1">Nya bokningar denna månad</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Bekräftade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.bekraftadeBokningar}</div>
            <p className="text-xs text-muted-foreground mt-1">Bekräftade bokningar</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Populära Tjänster</CardTitle>
          <CardDescription>De mest bokade tjänsterna</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.popularaTjanster.length === 0 ? (
            <p className="text-sm text-muted-foreground">Ingen data tillgänglig än</p>
          ) : (
            <div className="space-y-2">
              {stats.popularaTjanster.map((tjanst) => (
                <div key={tjanst.tjanstId} className="flex justify-between items-center">
                  <span className="text-sm">Tjänst ID: {tjanst.tjanstId}</span>
                  <span className="text-sm font-semibold">{tjanst.count} bokningar</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
