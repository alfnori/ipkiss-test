import ITruthStoreProvider from "@common/interfaces/truthStore";
import { container } from "tsyringe";
import TruthStoreProvider from "./TruthStoreProvider";

container.registerSingleton<ITruthStoreProvider>(
  "TruthStoreProvider",
  TruthStoreProvider,
);
