import cartesianProduct from "./cartesianProduct";

describe('cartesianProduct', () => {
  it('correctly crosses input arrays', () => {
    const sets = {
      a: [1, 2],
      b: [3, 4]
    };

    const product = [
        {a: 1, b: 3},
        {a: 1, b: 4},
        {a: 2, b: 3}, 
        {a: 2, b: 4}
    ];
    
    const res = cartesianProduct(sets);

    expect(res).toStrictEqual(product);
  })
})