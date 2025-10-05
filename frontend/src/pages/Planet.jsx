export default function Planet() {
  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <section className="skel h-64"></section>
      <section className="skel p-4 lg:col-span-2">
        <div className="h-10 wire mb-3"></div>
        <div className="h-10 wire mb-3"></div>
        <div className="h-10 wire mb-3"></div>
        <div className="h-40 wire"></div>
      </section>
    </div>
  )
}
