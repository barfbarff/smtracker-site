import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import type { MDXComponents } from 'mdx/types';
import {
  Callout,
  ExampleData,
  File,
  Files,
  Folder,
  IllustratedCard,
  IllustratedCards,
  Illustration,
  Kbd,
  Keys,
  Pipeline,
  Status,
  Step,
  Steps,
  Ui,
} from '@/components/docs';
import {
  Columns,
  ConditionRow,
  CropChartDiagram,
  CropModesDiagram,
  Flow,
  FrameTimingDiagram,
  LinkingRadiusDiagram,
  ReplicateBlocksDiagram,
} from '@/components/diagrams';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Steps,
    Step,
    Tabs,
    Tab,
    Callout,
    ExampleData,
    Files,
    Folder,
    File,
    IllustratedCards,
    IllustratedCard,
    Illustration,
    Kbd,
    Keys,
    Pipeline,
    Status,
    Ui,
    Columns,
    ConditionRow,
    CropChartDiagram,
    CropModesDiagram,
    Flow,
    FrameTimingDiagram,
    LinkingRadiusDiagram,
    ReplicateBlocksDiagram,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
