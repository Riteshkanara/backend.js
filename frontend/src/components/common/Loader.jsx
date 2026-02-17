export default function Loader({fullscreen = false}){
  if(fullscreen){
    return(
      <div className="fixed flex items-center justify-center bg-dark inset-0">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white "/>
      </div>
    )
  }
  return (
    <div className="flex justify-centerp-8">
      <div className=" animate-spin rounded-full h-8 w-8 border-b-2 border-white" ></div>
    </div>
  )
}































// export default function Loader({ fullScreen = false }) {
//   if (fullScreen) {
//     return (
//       <div className="fixed inset-0 bg-dark flex items-center justify-center z-50">
//         <div className="flex flex-col items-center gap-4">
//           <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
//           <p className="text-gray-400">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex items-center justify-center py-8">
//       <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
//     </div>
//   );
// }