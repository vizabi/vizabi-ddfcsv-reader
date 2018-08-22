export interface IReader {
  recordTransformer: Function;
  setRecordTransformer(recordTransformer: Function);
  readText(filePath: string, onFileRead: Function);
}

export interface IBaseReaderOptions {
  basePath: string;
  datasetsConfig?: object;
  conceptsLookup: Map<string, any>;
  datapackagePath: string;
  datapackage?: object;
  datasetPath: string;
  dataset: string;
  fileReader: IReader;
  logger?: any;
}

export interface IResource {
  primaryKey: string[] | string;
  resources: string[];
}

export interface IDatapackage {
  ddfSchema: {
    entities: IResource[];
    datapoints: IResource[];
    concepts: IResource[];
  };
}

export interface IPluginOptions {
  fileReader: IReader;
  basePath: string;
  datapackage: IDatapackage;
}

export interface IResourceSelectionOptimizer {
  isMatched(): boolean;

  getRecommendedFilesSet(): Promise<string[]>;
}