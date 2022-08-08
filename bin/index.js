"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
(0, dotenv_1.config)({ path: path_1.default.join(__dirname, `.env.${process.env.NODE_ENV}`) });
const apollo_server_express_1 = require("apollo-server-express");
const apollo_server_core_1 = require("apollo-server-core");
const schema_1 = require("@graphql-tools/schema");
const fs_1 = require("fs");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const ws_1 = __importDefault(require("ws"));
const ws_2 = require("graphql-ws/lib/use/ws");
const schemas_1 = __importDefault(require("./schemas"));
const resolvers_1 = __importDefault(require("./graphql/resolvers"));
const pubsub_1 = require("./graphql/pubsub");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const deserializeUser_1 = __importDefault(require("./context/deserializeUser"));
const img_1 = __importDefault(require("./routes/img"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const typeDefs = (0, fs_1.readFileSync)(require.resolve(path_1.default.join(__dirname, "./graphql/typeDefs.graphql"))).toString();
// read graphql files and insert into typeDefs variables for start apollo server
(0, schemas_1.default)();
function startApolloServer(typeDefs, resolvers) {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        const httpServer = http_1.default.createServer(app);
        const schema = (0, schema_1.makeExecutableSchema)({ typeDefs, resolvers });
        // combine typeDefs and resolvers
        const wsServer = new ws_1.default.Server({
            // This is the `httpServer` we created in a previous step.
            server: httpServer,
            // Pass a different path here if your ApolloServer serves at
            // a different path.
            path: "/subscriptions",
        });
        const serverCleanup = (0, ws_2.useServer)({ schema }, wsServer);
        // first parmas is schema at line 24 and second params wsServer info
        const server = new apollo_server_express_1.ApolloServer({
            schema,
            csrfPrevention: true,
            cache: "bounded",
            context: ({ req, res }) => ({
                pubsub: pubsub_1.pubsub,
                deserializeUser: (0, deserializeUser_1.default)(req),
                res,
                req,
            }),
            plugins: [
                (0, apollo_server_core_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
                {
                    serverWillStart() {
                        return __awaiter(this, void 0, void 0, function* () {
                            return {
                                drainServer() {
                                    return __awaiter(this, void 0, void 0, function* () {
                                        yield serverCleanup.dispose();
                                    });
                                },
                            };
                        });
                    },
                },
            ],
        });
        const corsOptions = {
            origin: [process.env.CLIENT_URL || "", "https://studio.apollographql.com"],
            credentials: true,
        };
        app.get("/", (req, res) => {
            return res.send("hi this is the forest api page");
        });
        app.use((0, cookie_parser_1.default)());
        app.use((0, cors_1.default)(corsOptions));
        app.use("/img", express_1.default.static("uploads"));
        app.use("/img", img_1.default);
        app.use(body_parser_1.default.json({
            limit: "50mb",
        }));
        app.use(body_parser_1.default.urlencoded({
            limit: "50mb",
            parameterLimit: 100000,
            extended: true,
        }));
        try {
            yield server.start();
            server.applyMiddleware({
                app,
                cors: corsOptions,
                path: "/graphql",
            });
            yield new Promise((resolve) => httpServer.listen({ port: process.env.PORT }, resolve));
            console.log(`Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`);
        }
        catch (err) {
            console.log(err);
        }
    });
}
startApolloServer(typeDefs, resolvers_1.default);
//# sourceMappingURL=index.js.map