const ShapeComponent = () => {
  const [current, setCurrent] = 
    useState<'circle' | 'square'>('circle');

  function changeShape(type: 'circle' | 'square') {
    // ...
  }

  function calculateArea(type: 'circle' | 'square') {
    // ...
  }
}