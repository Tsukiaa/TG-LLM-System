import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from DAO.models.My_ReGCN_model1.src.predict import predict_relation, predict_head_entity, predict_tail_entity

class InferenceService:
    def __init__(self):
        self.new_yt_data_path = './data/new_YT.json'
        self.entities_info_path = './data/entities_info.json'

    def relation_inference(self, type, head_entity, tail_entity, time):
        relation = predict_relation(type, head_entity, tail_entity, time)
        return relation

    def head_entity_inference(self, type, relaion, tail_entity, time):
        head_entity = predict_head_entity(type, relaion, tail_entity, time)
        return head_entity

    def tail_entity_inference(self, type, head_entity, ralation, time):
        tail_entity = predict_tail_entity(type, head_entity, ralation, time)
        return tail_entity