function MushafPage({ pageNumber, showTranslation, children }) {
  return (
    <div className={`mushaf-page${showTranslation ? " mushaf-bilingual" : ""}`}>
      {children}
      <div className="page-number">{pageNumber}</div>
    </div>
  );
}

export default MushafPage;
