export function isEmpty(value: string | null) {
  if (value && value !== "undefined" && value !== "null" && value !== "" && typeof value !== undefined) {
    return false;
  }
  return true;
}

export function checkEmpty(value: string) {
  console.log(value);
}

export const workInProgressAlert = () => {
  alert("Coming Soon");
};

// export function WarningAlert({ text }) {
//   if (!text) {
//     return null;
//   }
//   return (
//     <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
//       <div className="flex">
//         <div className="flex-shrink-0">
//           <ExclamationIcon
//             className="h-5 w-5 text-yellow-400"
//             aria-hidden="true"
//           />
//         </div>
//         <div className="ml-3">
//           <p className="text-xs text-yellow-700">{text}</p>
//         </div>
//       </div>
//     </div>
//   );
// }
