
import express from 'express';
const app = express();
app.use(express.json());
app.use(express.static('public'));

let offerText = '';

app.post('/offer-text',(req,res)=>{
  offerText = req.body.text || '';
  res.json({ status:'ok'});
});

app.get('/offer-text',(req,res)=>{
  res.json({ text: offerText });
});

function extractCompanyName(offerText) {
  const patterns = [
    /pour le compte de ([A-Z][A-Za-z0-9& -]+)/i,
    /rejoignez ([A-Z][A-Za-z0-9& -]+)/i,
    /notre client ([A-Z][A-Za-z0-9& -]+)/i
  ];

  for (const p of patterns) {
    const match = offerText.match(p);
    if (match) return match[1].trim();
  }

  return null;
}

app.post('/company-presentation', async (req, res) => {
  const { offerText } = req.body;

  const companyName = extractCompanyName(offerText);

  if (!companyName) {
    return res.json({
      text: generateFallbackPresentation()
    });
  }

  const info = await fetchCompanyInfo(companyName);

  if (!info) {
    return res.json({
      text: generateFallbackPresentation()
    });
  }

  res.json({
    text: generateCompanyPresentationDynamic(companyName, info)
  });
});

app.listen(3000, ()=>console.log('Serveur http://localhost:3000'));
