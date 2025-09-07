import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';
import { ChevronRight, Crown } from 'lucide-react';

type Node = {
  id: number;
  name: string;
  email: string;
  roleNames: string[];
  joinedAt?: string | null;
  children: Node[];
};

export default function Lineage({ root }: { root: Node }) {
  return (
    <AppLayout title={`Lineage: ${root.name}`}>
      <Head title={`Lineage: ${root.name}`} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-3 text-sm p-2">
        <ol className="flex items-center gap-1 text-muted-foreground">
          <li>
            <Link
              href={route('users.index')}
              className="hover:text-foreground transition-colors"
            >
              Users
            </Link>
          </li>
          <li><ChevronRight className="h-3.5 w-3.5" /></li>
          <li className="hidden sm:block">Lineage</li>
          <li className="hidden sm:block"><ChevronRight className="h-3.5 w-3.5" /></li>
          <li className="text-foreground font-medium truncate max-w-[60vw] sm:max-w-[40vw]">
            {root.name}
          </li>
        </ol>
      </nav>

      <div className="space-y-4 px-2" >
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              Lineage
              <ChevronRight className="h-4 w-4" />
              <span className="font-medium">{root.name}</span>
              {root.roleNames.some((r) => r.toLowerCase() === 'owner') && (
                <Crown className="h-4 w-4 text-amber-500 dark:text-amber-400" />
              )}
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-0">
            <Tree node={root} depth={0} />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

function Tree({ node, depth }: { node: Node; depth: number }) {
  return (
    <div className="mb-1.5">
      <div
        className="flex items-center gap-2"
        style={{ paddingLeft: depth * 14 }} // indent per depth
      >
        {depth > 0 && <span className="mr-1 h-5 border-l border-muted-foreground/30" />}

        <span className="truncate font-medium">{node.name}</span>

        <div className="flex flex-wrap items-center gap-1">
          {node.roleNames.map((r) => (
            <Badge key={r} variant="secondary" className="capitalize text-xs">
              {r}
            </Badge>
          ))}
        </div>

        <span className="ml-2 truncate text-xs text-muted-foreground">{node.email}</span>
      </div>

      {node.children?.length > 0 && (
        <div className="mt-1 space-y-1">
          {node.children.map((c) => (
            <Tree key={c.id} node={c} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
