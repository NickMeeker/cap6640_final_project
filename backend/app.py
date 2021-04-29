from flask import Flask, request
app = Flask(__name__)

from flask_cors import CORS
CORS(app)

import json

import torch


roberta_base = torch.hub.load('pytorch/fairseq', 'roberta.base')
roberta_base.eval()
roberta_large = torch.hub.load('pytorch/fairseq', 'roberta.large')
roberta_large.eval()
roberta_mnli = torch.hub.load('pytorch/fairseq', 'roberta.large.mnli')
roberta_mnli.eval()  


@app.route('/', methods = ['POST'])
def fill_mask():
  data =  json.loads(request.data)
  print(data, flush=True)
  message = data['message']
  k = data['k']

  if data['model'] == 'roberta.large':
    roberta = roberta_large
  elif data['model'] == 'roberta.large.mnli':
    roberta = roberta_mnli
  else:
    roberta = roberta_base

  result = roberta.fill_mask(message, topk=int(k))
  return {'result': result}