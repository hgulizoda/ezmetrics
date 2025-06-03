import { Fragment } from 'react';
import { Variant, Palette, Category, Component } from '@react-buddy/ide-toolbox';

export const PaletteTree = () => (
  <Palette>
    <Category name="App">
      <Component name="Loader">
        <Variant>
          <ExampleLoaderComponent />
        </Variant>
      </Component>
    </Category>
  </Palette>
);

export function ExampleLoaderComponent() {
  return <>Loading...</>;
}
