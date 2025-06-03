import { Previews, ComponentPreview } from '@react-buddy/ide-toolbox';

import { PaletteTree } from './palette';
import AllPackages from '../pages/dashboard/packages/all';

const ComponentPreviews = () => (
  <Previews palette={<PaletteTree />}>
    <ComponentPreview path="/AllPackages">
      <AllPackages />
    </ComponentPreview>
  </Previews>
);

export default ComponentPreviews;
