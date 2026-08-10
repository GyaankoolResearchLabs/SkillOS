function PageContainer({ children }) {

  return (

    <div className="flex-1 overflow-y-auto bg-[#F5F7FA]">

      <div className="p-10">

        {children}

      </div>

    </div>

  );

}

export default PageContainer;