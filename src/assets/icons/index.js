const req = require.context('./svg', false, /\.svg$/);

const requireAll = requireContext => requireContext.keys().map(requireContext);
// ==
//const requireAll = requireContext => requireContext.keys().map(item=>{
//     return requireContext(item);
// });

// 例子:
// function returnInt(element) {
//     return parseInt(element, 10);
// }

// ['1', '2', '3'].map(returnInt); // [1, 2, 3]

requireAll(req)
