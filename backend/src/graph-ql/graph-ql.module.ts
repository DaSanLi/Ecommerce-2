import { Module } from '@nestjs/common';
import { ReqTaskAuth } from '../task/scripts/task.types';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import type { ResponseWithCookie } from '../auth/scripts/auth.types';

// ─── Importar registros de enums para que se ejecuten en startup ───
import '../graphql/enums/task-status.enum';
import '../graphql/enums/gender.enum';
import '../graphql/enums/priority-state.enum';

 @Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/graph-ql/schema.gql'),
            playground: false,
            sortSchema: true,
            
            // Landing Page / Apollo Sandbox: SOLO en desarrollo
            // En producción no exponemos landing page
            plugins: process.env.NODE_ENV === 'production'
                ? []
                : [ApolloServerPluginLandingPageLocalDefault()],
            
            // Introspección GraphQL: SOLO en desarrollo
            // Permite a clientes (como Apollo Sandbox) explorar el esquema
            // En producción debería estar desactivada por seguridad
            introspection: process.env.NODE_ENV !== 'production',
            
            context: ({ req, res }: { req: ReqTaskAuth; res: ResponseWithCookie }) => ({ req, res }),
        }),
    ] as const,
    providers: [] as const,
    exports: [] as const,
})
export class GraphQlModule {}


