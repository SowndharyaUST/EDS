import {
  div, span, input, label, img,
} from '../../scripts/dom-helpers.js';

async function getProductData(stateCode, cityCode) {
  const baseUrl = 'https://dev1.heromotocorp.com/content/hero-commerce/in/en/products/product-page/practical/jcr:content.product.practical.splendor-plus';

  // Construct the final URL dynamically
  const apiUrl = `${baseUrl}.${stateCode}.${cityCode}.json`;
  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    return null;
  }
}

export default async function decorate(block) {
  const productData = await getProductData('DEL', 'DELHI');

  const variantsData = productData.data.products.items[0].variant_to_colors;
  block.innerHTML = '';
  block.append(
    div(
      { class: 'variants-wrapper' },
      div({ class: 'variants-list' }),
      div({ class: 'image-wrapper' }),
      div({ class: 'colors-wrapper' }),
    ),
  );
  const variantsList = document.querySelector('.variants-list');
  variantsList.innerHTML = '';
  const colorsList = document.querySelector('.colors-wrapper');
  colorsList.innerHTML = '';
  const imageWrapper = document.querySelector('.image-wrapper');
  imageWrapper.innerHTML = '';
  Array.from(variantsData).forEach((child, index) => {
    let checkedValue = false;
    if (index == 0) {
      checkedValue = true;
    }
    const item = div(
      { class: 'variant-item' },
      input({
        class: 'variant-radio',
        type: 'radio',
        name: 'variant',
        checked: checkedValue,
        id: child.value_index,
        value: child.label,
      }),
      label(child.label),
      div({ class: 'variant-price' }, `[ ₹ ${child.variant_price} ] `),
    );
    const colorList = div({ class: 'colors-list', id: child.value_index });

    variantsList.append(item);
    Array.from(child.colors).forEach((color, colorIdx) => {
      let colorClass = 'color-item';
      // const imageUrl = '';

      if (colorIdx == 0) {
        colorClass = 'color-item active';
      }
      const colorItem = div(
        { class: colorClass },
        span(color.label),
        img({
          src: `https://www.heromotocorp.com${color.color_swatch_url}`, id: color.value_index, class: 'color-swatch', sku: color.sku,
        }),
      );
      colorList.append(colorItem);
    });
    colorsList.append(colorList);
  });
}
