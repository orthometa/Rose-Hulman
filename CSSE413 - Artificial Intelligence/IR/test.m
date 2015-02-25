%load('/home/jon/workspace/CSSE413-AI/IR/data.mat');
queries={
    {'adams'},
    {'lincoln'},
    {'president'},
    {'assassinated','president'},
    {'great','president'},
    {'first','president'},
    {'civil','war','president'},
    {'united', 'states'},
    {'USA'},
    {'good', 'president'},
    {'president', 'who', 'is', 'good'},
    {'international', 'war'},
    {'elected', '1982'},
    {'election', '1982'},
    {'business', 'growth'},
    {'economy'},
    {'abolish', 'slavery'},
    {'war'},
    {'civil', 'war'},
    {'soviet', 'russia'},
    {'soviet', 'russia', 'leader'}
 };
 for i=1:length(queries)
     query=queries{i};
     
     
     passagescores=passage_term_matching(data,query);
     counter=j
     for j=1:length(data)
         scores_passage_term_matching(i,j)=passagescores(j);
         
        scores_BM25(i,j)=BM25({data{j,1},data{j,2}},query);
         
         scores_skip_bi_gram(i,j)=skip_bi_gram(data{j,2},query);
     end
 end
close all
for num=1:length(queries)

figure(num)
plot(1:length(data),scores_BM25(num,:)/max(scores_BM25(num,:)),'g');
hold on;

plot(1:length(data),scores_skip_bi_gram(num,:)/max(scores_skip_bi_gram(num,:)),'r');

plot(1:length(data),scores_passage_term_matching(num,:)/max(scores_passage_term_matching(num,:)));
legend ('BM25','skip-bigram','passage term matching');
xlabel('number of analyzed text file');
ylabel('normalized score');
title ([{'response of query number '} num2str(num)]);
end

topTen_BM25={};
topTen_passage_term_matching={};
topTen_skip_bi_gram={};
for (i=1:length(queries))
    temp=[scores_passage_term_matching(i,:);1:length(data)];
    temp=sortrows(temp');
    temp=flipud(temp);
    temp=temp(1:10,:);
    for j=1:10
        strings{j}=data{temp(j,2),  1};
    end
    
    topTen_passage_term_matching=[topTen_passage_term_matching temp {strings}];
    temp=[scores_BM25(i,:);1:length(data)];
    temp=sortrows(temp');
    temp=flipud(temp);
    temp=temp(1:10,:);
    for j=1:10
        strings{j}=data{temp(j,2),  1};
    end
    topTen_BM25=[topTen_BM25 temp {strings}];
    temp=[scores_skip_bi_gram(i,:);1:length(data)];
    temp=sortrows(temp');
    temp=flipud(temp);
    temp=temp(1:10,:);
    for j=1:10
        strings{j}=data{temp(j,2),  1};
    end
    topTen_skip_bi_gram=[topTen_skip_bi_gram temp {strings}];   
    
end

fprintf('TOP TEN SKIP BI GRAM\n');
i = 1;
while (i < length(topTen_skip_bi_gram)) %for i=1:length(topTen_BM25)
    fprintf('Query %d, %s\n ', (i+1)/2, queries{(i+1)/2}{1});
    %disp(topTen_BM25{i})
    disp(topTen_skip_bi_gram{1, i})
    i = i + 2;
end

fprintf('TOP TEN SKIP BM25\n');
i = 1;
while (i < length(topTen_BM25)) %for i=1:length(topTen_BM25)
    fprintf('Query %d, %s\n ', (i+1)/2, queries{(i+1)/2}{1});
    %disp(topTen_BM25{i})
    disp(topTen_BM25{1, i})
    i = i + 2;
end

fprintf('TOP TEN topTen_passage_term_matching\n');
i = 1;
while (i < length(topTen_passage_term_matching)) %for i=1:length(topTen_BM25)
    fprintf('Query %d, %s\n ', (i+1)/2, queries{(i+1)/2}{1});
    %disp(topTen_BM25{i})
    disp(topTen_passage_term_matching{1, i})
    i = i + 2;
end



